'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useConfigState } from '../context';

import ROUTES from '@/configs/routes';
import { handleRequest } from '@/helpers/asyncHandlers';
import { toWei } from '@/helpers/common';
import useETHBridgeContract from '@/hooks/useETHBridgeContract';
import useNotifier from '@/hooks/useNotifier';
import { NETWORK_TYPE } from '@/models/network/network';
import { WALLET_NAME } from '@/models/wallet';
import adminService, { ParamCommonConfig } from '@/services/adminService';
import {
  getWalletInstanceSlice,
  getWalletSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { walletSliceActions } from '@/store/slices/walletSlice';

export type CommonConfigBody = {
  id: number;
  tip: string;
  dailyQuota: string;
  feeUnlockMina: string;
  feeUnlockEth: string;
};

export default function useConfigLogic() {
  const { sendNotification } = useNotifier();
  const { setIsLoading, setDisplayedConfig, updateAssetRage } =
    useConfigState().methods;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { value, asset, displayedConfig, assetRange } = useConfigState().state;
  // console.log('🚀 ~ useConfigLogic ~ asset:', {
  //   bridgeCtr: asset?.bridgeCtrAddr,
  //   tokenCtr: asset?.tokenAddr,
  // });

  const { networkInstance, walletInstance } = useAppSelector(
    getWalletInstanceSlice
  );
  const { address, isConnected } = useAppSelector(getWalletSlice);

  const bridgeEVMCtr = useETHBridgeContract({
    ctr: asset
      ? {
          addr: asset.bridgeCtrAddr,
          network: asset.network,
        }
      : null,
    network: networkInstance.src,
  });

  const getCommonConfig = useCallback(async () => {
    if (!isConnected) return null;
    const [res, error] = await handleRequest(adminService.getCommonConfig());
    if (error) {
      if (error.response.data.statusCode === 401) {
        dispatch(walletSliceActions.disconnect());
        router.push(ROUTES.HOME);
        return;
      }
      sendNotification({
        toastType: 'error',
        options: {
          title: 'Can get current config',
        },
      });
      return null;
    }

    setDisplayedConfig({
      dailyQuota: res!!.dailyQuota,
      tip: res!!.tip,
      feeUnlockEth: res!!.feeUnlockEth,
      feeUnlockMina: res!!.feeUnlockMina,
    });
    return res;
  }, [sendNotification, isConnected]);

  const updateCommonConfig = useCallback(
    async ({
      id,
      tip,
      dailyQuota,
      feeUnlockEth,
      feeUnlockMina,
    }: CommonConfigBody) => {
      setIsLoading(true);
      const configData: ParamCommonConfig = {
        id,
        tip: !!tip ? Number(tip) : Number(displayedConfig.tip),
        dailyQuota: !!dailyQuota
          ? Number(dailyQuota)
          : Number(displayedConfig.dailyQuota),
        feeUnlockEth: !!feeUnlockEth
          ? feeUnlockEth
          : displayedConfig.feeUnlockEth,
        feeUnlockMina: !!feeUnlockMina
          ? feeUnlockMina
          : displayedConfig.feeUnlockMina,
      };

      const [res, error] = await handleRequest(
        adminService.updateCommonConfig(configData)
      );
      if (error) {
        sendNotification({
          toastType: 'error',
          options: {
            title: error.message,
          },
        });
        return false;
      }
      sendNotification({
        toastType: 'success',
        options: {
          title: 'Update successfully',
        },
      });
      setIsLoading(false);
      return true;
    },
    [sendNotification, setIsLoading, displayedConfig]
  );

  async function handleEVMBridge(): Promise<boolean> {
    if ((!value.min && !value.max) || !bridgeEVMCtr || !address) return false;

    const minAmount = !!value.min ? value.min : assetRange[0];
    const maxAmount = !!value.max ? value.max : assetRange[1];

    const [amount, error] = await handleRequest(
      bridgeEVMCtr.setMinMaxAmount({
        min: minAmount,
        max: maxAmount,
        userAddr: address,
        asset: asset!!,
      })
    );

    if (error) {
      sendNotification({
        toastType: 'error',
        options: {
          title: 'Transaction rejected',
        },
      });
      return false;
    }
    if (amount) {
      sendNotification({
        toastType: 'success',
        options: {
          title: 'Update successfully',
        },
      });
      updateAssetRage([minAmount, maxAmount]);
      return true;
    }

    return false;
  }

  async function handleZKBridge(address: string): Promise<boolean> {
    // console.log('🚀 ~ handleZKBridge ~ value.min:', value.min);
    // console.log('🚀 ~ handleZKBridge ~ value.min:', value.max);
    // setIsLoading(true);
    if (!walletInstance || (!value.min && !value.max)) return false;

    if (!asset?.bridgeCtrAddr || !asset?.tokenAddr) return false;

    try {
      const { PublicKey } = await import('o1js');
      const { default: ERC20Contract } = await import(
        '@/models/contract/zk/contract.ERC20'
      );

      const ctr = new ERC20Contract(asset?.bridgeCtrAddr, asset?.tokenAddr);

      // fetch involve into the process accounts
      await ctr.fetchInvolveAccount(address);
      // console.log('🚀 ~ useConfigLogic ~ address:', address);

      if (value.max && !value.min) {
        const min = toWei(assetRange[0], asset.decimals);
        const max = toWei(value.max, asset.decimals);
        // build tx
        // console.log('building tx...', min, max);
        const tx = await ctr.provider.transaction(
          {
            sender: PublicKey.fromBase58(address),
            fee: Number(0.1) * 1e9,
          },
          async () => {
            await ctr.setAmountLimits(Number(min), Number(max));
          }
        );

        await tx.prove();
        // console.log('🚀 ~ handleZKBridge ~ tx:', tx.toPretty());

        // only when a tx is proved then system will start send payment request

        // send tx via wallet instances
        switch (walletInstance.name) {
          case WALLET_NAME.AURO:
            await walletInstance.sendTx(tx.toJSON());
            break;
          case WALLET_NAME.METAMASK:
            await walletInstance.sendTx({
              transaction: tx.toJSON(),
              fee: Number(0.1),
            });
            break;
          default:
            break;
        }

        updateAssetRage([assetRange[0], value.max]);
        sendNotification({
          toastType: 'success',
          options: {
            title: 'Transaction Submitted',
          },
        });
        return true;
      }

      if (!value.max && value.min) {
        const min = toWei(value.min, asset.decimals);
        const max = toWei(assetRange[1], asset.decimals);
        // build tx
        // console.log('building tx...', min, max);
        const tx = await ctr.provider.transaction(
          {
            sender: PublicKey.fromBase58(address),
            fee: Number(0.1) * 1e9,
          },
          async () => {
            await ctr.setAmountLimits(Number(min), Number(max));
          }
        );

        await tx.prove();
        // console.log('🚀 ~ handleZKBridge ~ tx:', tx.toPretty());

        // only when a tx is proved then system will start send payment request

        // send tx via wallet instances
        switch (walletInstance.name) {
          case WALLET_NAME.AURO:
            await walletInstance.sendTx(tx.toJSON());
            break;
          case WALLET_NAME.METAMASK:
            await walletInstance.sendTx({
              transaction: tx.toJSON(),
              fee: Number(0.1),
            });
            break;
          default:
            break;
        }

        updateAssetRage([value.min, assetRange[1]]);
        sendNotification({
          toastType: 'success',
          options: {
            title: 'Update successfully',
          },
        });
        return true;
      }
      const min = toWei(value.min, asset.decimals);
      const max = toWei(value.max, asset.decimals);
      // build tx
      // console.log('building tx...', min, max);
      const tx = await ctr.provider.transaction(
        {
          sender: PublicKey.fromBase58(address),
          fee: Number(0.1) * 1e9,
        },
        async () => {
          await ctr.setAmountLimits(Number(min), Number(max));
        }
      );

      await tx.prove();
      // console.log('🚀 ~ handleZKBridge ~ tx:', tx.toPretty());

      // only when a tx is proved then system will start send payment request

      // send tx via wallet instances
      switch (walletInstance.name) {
        case WALLET_NAME.AURO:
          await walletInstance.sendTx(tx.toJSON());
          break;
        case WALLET_NAME.METAMASK:
          await walletInstance.sendTx({
            transaction: tx.toJSON(),
            fee: Number(0.1),
          });
          break;
        default:
          break;
      }

      updateAssetRage([value.min, value.max]);
      sendNotification({
        toastType: 'success',
        options: {
          title: 'Transaction Submitted',
        },
      });
      return true;
    } catch (error) {
      // console.log('🚀 ~ useModalConfirmLogic ~ error:', error);
      sendNotification({
        toastType: 'error',
        options: {
          title: 'Rejected Transaction',
        },
      });
      return false;
    }
  }

  async function updateContractConfig(): Promise<boolean> {
    if (!networkInstance.src || !address) return false;

    switch (networkInstance.src.type) {
      case NETWORK_TYPE.EVM:
        return await handleEVMBridge();
      case NETWORK_TYPE.ZK:
        return await handleZKBridge(address);
      default:
        return false;
    }
  }

  return {
    updateCommonConfig,
    getCommonConfig,
    updateContractConfig,
  };
}
