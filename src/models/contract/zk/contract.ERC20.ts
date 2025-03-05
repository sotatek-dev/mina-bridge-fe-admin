import { FungibleToken } from 'mina-fungible-token';
import { Mina, PublicKey, UInt64, fetchAccount } from 'o1js';

import { Bridge } from '@/configs/ABIs/Bridge';
import { ZkContractType } from '@/configs/constants';
import {
  fetchFiles,
  fileSystem,
  getMinaNetworkId,
  getMinaProxyUrl,
} from '@/helpers/common';

export default class ERC20Contract {
  bridgeAddress: PublicKey;
  tokenAddress: PublicKey;
  contractBridgeInstance: Bridge | null;
  contractTokenInstance: FungibleToken | null;
  provider: typeof Mina;

  constructor(bridgeAddress: string, tokenAddress: string) {
    Mina.setActiveInstance(
      Mina.Network({
        mina: getMinaProxyUrl(),
        archive: 'https://api.minascan.io/archive/devnet/v1/graphql',
        networkId: getMinaNetworkId(),
      })
    );

    this.provider = Mina;
    this.bridgeAddress = PublicKey.fromBase58(bridgeAddress);
    this.tokenAddress = PublicKey.fromBase58(tokenAddress);

    this.contractTokenInstance = new FungibleToken(this.tokenAddress);
    this.contractBridgeInstance = new Bridge(this.bridgeAddress);
  }
  static async init() {
    try {
      console.log('-----fetch files');
      console.time('fetch files');
      const [cacheTokenFiles, cacheBridgeFiles] = await Promise.all([
        fetchFiles(ZkContractType.TOKEN),
        fetchFiles(ZkContractType.BRIDGE),
      ]);
      console.log('fetch files done');
      console.log('compile contracts');
      console.timeEnd('fetch files');
      console.time('compile contracts');

      console.log('-----compile contracts Bridge');
      await Bridge.compile({
        cache: fileSystem(cacheBridgeFiles),
      });
      console.log('-----compile contracts FungibleToken');
      await FungibleToken.compile({
        cache: fileSystem(cacheTokenFiles),
      });
      console.log('-----compile contracts done');
      // console.timeEnd('compile contracts');
    } catch (error) {
      console.error(error);
    }
  }

  async fetchInvolveAccount(userAddr: string) {
    console.log('-----fetch user account');
    const data = await fetchAccount({
      publicKey: PublicKey.fromBase58(userAddr),
    });
    // console.log('🚀 ~ ERC20Contract ~ fetchInvolveAccount ~ data:', data);

    console.log('-----fetch bridge account');
    await fetchAccount({
      publicKey: this.bridgeAddress,
      tokenId: this.contractTokenInstance?.tokenId,
    });

    console.log('-----fetch token account');
    await fetchAccount({ publicKey: this.tokenAddress });
  }

  async setAmountLimits(min: number, max: number) {
    if (!this.contractBridgeInstance) return;
    const minAmount = new UInt64(min);
    const maxAmount = new UInt64(max);
    // console.log('🚀 ~ setAmountLimits:', { minAmount, maxAmount });
    return this.contractBridgeInstance?.setAmountLimits(minAmount, maxAmount);
  }

  async getMinAmount() {
    if (!this.contractBridgeInstance) return;

    return this.contractBridgeInstance.minAmount.getAndRequireEquals();
  }

  async getMaxAmount() {
    if (!this.contractBridgeInstance) return;

    return this.contractBridgeInstance.maxAmount.getAndRequireEquals();
  }
}
