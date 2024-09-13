import { Mina, PublicKey, UInt64, fetchAccount } from 'o1js';

import { Bridge } from '@/configs/ABIs/Bridge';
import Token from '@/configs/ABIs/Erc20_mina';

export default class ERC20Contract {
  bridgeAddress: PublicKey;
  tokenAddress: PublicKey;
  contractBridgeInstance: Bridge | null;
  contractTokenInstance: Token | null;
  provider: typeof Mina;

  constructor(bridgeAddress: string, tokenAddress: string) {
    Mina.setActiveInstance(
      Mina.Network({
        // mina: 'https://api.minascan.io/node/berkeley/v1/graphql',
        mina: 'https://api.minascan.io/node/berkeley/v1/graphql',
        archive: 'https://api.minascan.io/archive/berkeley/v1/graphql',
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
    await Bridge.compile();
    console.log('Bridge compile');

    await Token.compile();
    console.log('Token compile');
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
    return this.contractBridgeInstance.config(
      newMinter,
      UInt64.from(min),
      UInt64.from(max)
    );
  }

  async getMinAmount() {
    if (!this.contractBridgeInstance) return;
    return this.contractBridgeInstance.minAmount.get();
  }

  async getMaxAmount() {
    if (!this.contractBridgeInstance) return;
    return this.contractBridgeInstance.maxAmount.get();
  }
}
