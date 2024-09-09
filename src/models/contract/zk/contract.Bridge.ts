import { FungibleToken } from 'mina-fungible-token';
import { Field, Mina, PublicKey, UInt64, fetchAccount } from 'o1js';

import { Bridge } from '@/configs/ABIs/zk/Bridge';
import { handleAsync } from '@/helpers/asyncHandlers';
import { Network } from '@/models/network';

export default class BridgeContract {
  tokenAddress: PublicKey;
  bridgeAddress: PublicKey;
  provider: typeof Mina;
  bridgeInstance: Bridge;
  tokenInstance: FungibleToken;

  constructor(bridgeAddress: string, tokenAddress: string, network: Network) {
    if ('proxyUrl' in network.metadata && network.metadata.proxyUrl) {
      Mina.setActiveInstance(
        Mina.Network({
          mina: network.metadata.proxyUrl,
          archive:
            network.metadata.archiveUrl ||
            'https://api.minascan.io/archive/berkeley/v1/graphql/',
        })
      );
    }

    this.provider = Mina;
    this.tokenAddress = PublicKey.fromBase58(tokenAddress);
    this.bridgeAddress = PublicKey.fromBase58(bridgeAddress);

    this.tokenInstance = new FungibleToken(this.tokenAddress);
    this.bridgeInstance = new Bridge(this.bridgeAddress);
  }
  static async init() {
    // const [cacheBridgeFiles] = await Promise.all([
    //   fetchFiles(ZkContractType.BRIDGE),
    // ]);
    // console.log('-----compile bridge');
    // await Bridge.compile({
    //   cache: fileSystem(cacheBridgeFiles),
    // });
  }

  changeInstance(bridgeAddress: string, tokenAddress: string) {
    this.tokenAddress = PublicKey.fromBase58(tokenAddress);
    this.bridgeAddress = PublicKey.fromBase58(bridgeAddress);
    this.tokenInstance = new FungibleToken(this.tokenAddress);
    this.bridgeInstance = new Bridge(
      this.bridgeAddress,
      this.tokenInstance.tokenId
    );
  }

  async fetchInvolveAccount() {
    console.log('-----fetch token account');
    await fetchAccount({ publicKey: this.tokenAddress });

    console.log('-----fetch bridge account');
    await fetchAccount({ publicKey: this.bridgeAddress });

    console.log('-----fetch bridge account with token');
    await fetchAccount({
      publicKey: this.bridgeAddress,
      tokenId: this.tokenInstance.tokenId,
    });
  }

  fetchMinMax() {
    const bridgeInstance = this.bridgeInstance;

    return handleAsync(null, async () => ({
      min: await bridgeInstance.minAmount.get(),
      max: await bridgeInstance.maxAmount.get(),
    }));
  }

  async lock(receipt: string, amount: string) {
    if (!this.bridgeInstance) return;
    return this.bridgeInstance.lock(UInt64.from(amount), Field.from(receipt));
  }
}
