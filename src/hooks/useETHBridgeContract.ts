'use client';
import { useMemo } from 'react';

import CONTRACT_ADDRESSES from '@/configs/contractAddresses';
import { IsServer } from '@/constants';
import { PROVIDER_TYPE, ProviderType } from '@/models/contract/evm/contract';
import BridgeContract from '@/models/contract/evm/contract.bridge';
import Network, { NETWORK_TYPE } from '@/models/network/network';
import { WALLET_INJECT_OBJ } from '@/models/wallet/wallet.abstract';
import { getWalletInstanceSlice, useAppSelector } from '@/store';

type params = {
  network: Network | null;
  ctr: {
    addr: string;
    network: string;
  } | null;
  // ctrAddr?: string;
  provider?: ProviderType;
};

export default function useETHBridgeContract({
  network,
  ctr,
  // ctrAddr,
  provider = {
    type: PROVIDER_TYPE.WALLET,
    injectObject: WALLET_INJECT_OBJ.METAMASK,
  },
}: params) {
  const { walletInstance } = useAppSelector(getWalletInstanceSlice);

  return useMemo(() => {
    if (IsServer) return null;

    return !network ||
      network.type === NETWORK_TYPE.ZK ||
      !ctr ||
      network.name !== ctr.network || // double check for case contract and network not update synchronous
      !walletInstance
      ? null
      : new BridgeContract({
          address: ctr.addr || CONTRACT_ADDRESSES.BRIDGE_ETH || '',
          provider,
        });
  }, [network, provider, ctr, walletInstance]);
}
