import { FungibleToken } from 'mina-fungible-token';
import { Mina, PublicKey, UInt64, fetchAccount } from 'o1js';

import { Bridge } from '@/configs/ABIs/Bridge';
import Token from '@/configs/ABIs/Erc20_mina';
import { ZkContractType } from '@/configs/constants';
import { fetchFiles, fileSystem } from '@/helpers/common';

export default class ERC20Contract {
  bridgeAddress: PublicKey;
  tokenAddress: PublicKey;
  contractBridgeInstance: Bridge | null;
  contractTokenInstance: Token | null;
  provider: typeof Mina;

  constructor(bridgeAddress: string, tokenAddress: string) {
    Mina.setActiveInstance(
      Mina.Network({
        mina: 'https://api.minascan.io/node/devnet/v1/graphql',
        archive: 'https://api.minascan.io/archive/devnet/v1/graphql',
      })
    );

    this.provider = Mina;
    this.bridgeAddress = PublicKey.fromBase58(bridgeAddress);
    this.tokenAddress = PublicKey.fromBase58(tokenAddress);

    this.contractTokenInstance = new Token(this.tokenAddress);
    this.contractBridgeInstance = new Bridge(
      this.bridgeAddress,
      //TODO this.contractTokenInstance.token.id
      this.contractTokenInstance.tokenId
    );
  }
  static async init() {
    // TODO: ZK compile
    try {
      console.log('-----fetch files');
      console.time('fetch files');
      const [cacheTokenFiles, cacheBridgeFiles] = await Promise.all([
        fetchFiles(ZkContractType.TOKEN),
        fetchFiles(ZkContractType.BRIDGE),
      ]);
      console.log('-----fetch files done');
      console.timeEnd('fetch files');
      console.time('compile contracts');
      console.log('-----compile contracts');
      await Bridge.compile({
        cache: fileSystem(cacheBridgeFiles),
      });
      await FungibleToken.compile({
        cache: fileSystem(cacheTokenFiles),
      });
      console.log('-----compile contracts done');
      console.timeEnd('compile contracts');
    } catch (error) {
      console.log('error', error);
    }
  }

  async fetchInvolveAccount(userAddr: string) {
    console.log('-----fetch user account');
    const data = await fetchAccount({
      publicKey: PublicKey.fromBase58(userAddr),
    });
    console.log('🚀 ~ ERC20Contract ~ fetchInvolveAccount ~ data:', data);

    console.log('-----fetch bridge account');
    await fetchAccount({
      publicKey: this.bridgeAddress,
      //TODO tokenId: this.contractTokenInstance?.token.id,
      tokenId: this.contractTokenInstance?.tokenId,
    });

    console.log('-----fetch token account');
    await fetchAccount({ publicKey: this.tokenAddress });
  }

  approveUpdate() {
    if (!this.contractTokenInstance || !this.contractBridgeInstance) return;
    return this.contractTokenInstance.approveUpdate(
      this.contractBridgeInstance.self
    );
  }

  async config(min: number, max: number, address: string) {
    const newMinter = PublicKey.fromBase58(address);
    console.log('🚀 ~ ERC20Contract ~ config ~ address:', newMinter);
    if (!this.contractBridgeInstance || !this.contractTokenInstance) return;

    // TODO:
    // return this.contractBridgeInstance.config(
    //   newMinter,
    //   UInt64.from(min),
    //   UInt64.from(max)
    // );
    return true;
  }

  async getMinAmount() {
    if (!this.contractBridgeInstance) return;

    // TODO:
    // return this.contractBridgeInstance.minAmount.get();
    return 10;
  }

  async getMaxAmount() {
    if (!this.contractBridgeInstance) return;

    // TODO:
    // return this.contractBridgeInstance.maxAmount.get();
    return 100;
  }
}
