import React, { useEffect, useMemo, useState } from "react";

import { MODAL_NAME } from "@/configs/modal";
import { IsServer } from "@/constants";
import Network, { NETWORK_NAME, NETWORK_TYPE } from "@/models/network/network";
import { getUISlice, getWalletInstanceSlice, getWalletSlice, useAppSelector } from "@/store";
import { TokenType } from "@/store/slices/persistSlice";

export type ZKContractCtxValueType = {
  state: {
    isInitialized: boolean;
    isInitializing: boolean;
    erc20Contract: any;
    bridgeContract: any;
  };
  constants: {};
  methods: {};
};

export type ZKContractInitializeProps = React.PropsWithChildren<{}>;

const initialValue: ZKContractCtxValueType = {
  state: {
    isInitialized: false,
    isInitializing: false,
    erc20Contract: null,
    bridgeContract: null,
  },
  constants: {},
  methods: {},
};

const ZKContractCtx = React.createContext<ZKContractCtxValueType>(initialValue);

export function useZKContractState() {
  if (IsServer) return initialValue;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useContext(ZKContractCtx);
}

export default function ZKContractProvider({
  children,
}: ZKContractInitializeProps) {
  const { networkInstance } = useAppSelector(getWalletInstanceSlice);
  const { modals } = useAppSelector(getUISlice);
  const { asset } = useAppSelector(getWalletSlice);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  const [erc20Contract, setErc20Contract] = useState<any>(null);
  const [bridgeContract, setBridgeContract] = useState<any>(null);

  const modalConnectWallet = useMemo(
    () => modals[MODAL_NAME.CONNECT_WALLET],
    [modals]
  );
  const modalConnectWalletSuccess = useMemo(
    () => modals[MODAL_NAME.SUCCESS_ACTION],
    [modals]
  );
  async function handleInitializeScripts(
    asset: TokenType,
    nwInstance: Network
  ) {
    if (isInitializing || isInitialized) return;

    setIsInitializing(true);

    try {
      const ERC20Module = await import('@/models/contract/zk/contract.ERC20');
      const BridgeModule = await import('@/models/contract/zk/contract.Bridge');

      const ERC20ContractC = ERC20Module.default;
      const BridgeContractC = BridgeModule.default;

      await ERC20ContractC.init();
      await BridgeContractC.init();

      console.log('🚀 ~ asset:', asset);

      const erc20Ctr = new ERC20ContractC(asset.tokenAddr, nwInstance);
      const bridgeCtr = new BridgeContractC(
        asset.bridgeCtrAddr,
        asset.tokenAddr,
        nwInstance
      );

      setErc20Contract(erc20Ctr);
      setBridgeContract(bridgeCtr);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing contracts:', error);
    } finally {
      setIsInitializing(false);
    }
  }

  function handleChangeInstance(asset: TokenType) {
    if (!erc20Contract || !bridgeContract) return;
    // only change when token change
    if (
      asset.network === NETWORK_NAME.MINA &&
      asset.tokenAddr !== erc20Contract.tokenAddress.toBase58()
    ) {
      erc20Contract.changeInstance(asset.tokenAddr);
      bridgeContract.changeInstance(asset.bridgeCtrAddr, asset.tokenAddr);
    }
  }

  // initialize instances
  useEffect(() => {
    // console.log(
    //   !networkInstance.src,
    //   networkInstance?.src?.type !== NETWORK_TYPE.ZK,
    //   !asset,
    //   isInitialized,
    //   modalConnectWallet.isOpen,
    //   modalConnectWalletSuccess.isOpen
    // );
    console.log('Asset: ', asset);
    if (
      !networkInstance.src ||
      networkInstance.src.type !== NETWORK_TYPE.ZK ||
      !asset ||
      isInitialized ||
      modalConnectWallet.isOpen ||
      modalConnectWalletSuccess.isOpen
    )
      return;

    // const asset: any = {
    //   pairId: '1',
    //   bridgeCtrAddr: 'B62qoArtCz52mtxKxtGR3sPdS9yq6DucRW53nAerndwg9oEhUvJvpRy',
    //   tokenAddr: 'B62qqki2ZnVzaNsGaTDAP6wJYCth5UAcY6tPX2TQYHdwD8D4uBgrDKC',
    //   des: 'tar',
    //   symbol: 'WETH',
    //   name: '',
    //   decimals: 9,
    //   network: 'mina',
    // };

    // const networkIn: any = {
    //   src: {
    //     name: 'mina',
    //     type: 'ZK',
    //     nativeCurrency: {
    //       name: 'MINA',
    //       symbol: 'MINA',
    //       decimals: 9,
    //     },
    //     metadata: {
    //       chainId: 'mina:testnet',
    //       chainType: 'devnet',
    //       chainName: 'Mina Devnet',
    //       proxyUrl: 'https://api.minascan.io/node/devnet/v1/graphql',
    //       archiveUrl: '',
    //       scanUrl: 'https://minascan.io/devnet',
    //       logo: {
    //         base: '/assets/logos/logo.mina.circle.svg',
    //         header: '/assets/logos/logo.mina.circle.svg',
    //       },
    //     },
    //   },
    //   tar: {
    //     name: 'ethereum',
    //     type: 'EVM',
    //     nativeCurrency: {
    //       name: 'ETH',
    //       symbol: 'ETH',
    //       decimals: 18,
    //     },
    //     metadata: {
    //       chainId: '0xaa36a7',
    //       chainType: 'testnet',
    //       chainName: 'sepolia',
    //       provider: {
    //         type: 'https',
    //         uri: 'https://rpc.sepolia.ethpandaops.io',
    //       },
    //       scanUrl: 'https://sepolia.etherscan.io',
    //       logo: {
    //         base: '/assets/logos/logo.ethereum.circle.svg',
    //         header: '/assets/logos/logo.ethereum.circle.svg',
    //       },
    //     },
    //   },
    // };

    handleInitializeScripts(asset, networkInstance.src);
  }, [
    networkInstance.src,
    asset,
    isInitialized,
    modalConnectWallet.isOpen,
    modalConnectWalletSuccess.isOpen,
  ]);

  // change instances when asset change and isInitialized
  useEffect(() => {
    if (
      !networkInstance.src ||
      networkInstance.src.type !== NETWORK_TYPE.ZK ||
      !asset ||
      !isInitialized
    )
      return;
    handleChangeInstance(asset);
  }, [networkInstance.src, asset, isInitialized]);

  const value = useMemo<ZKContractCtxValueType>(
    () => ({
      state: { isInitialized, isInitializing, erc20Contract, bridgeContract },
      constants: {},
      methods: {},
    }),
    [isInitialized, isInitializing, erc20Contract, bridgeContract]
  );

  return (
    <ZKContractCtx.Provider value={value}>{children}</ZKContractCtx.Provider>
  );
}
