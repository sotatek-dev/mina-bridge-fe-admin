import Contract, { InitializeContractType } from './contract';

import ABIBridgeETH from '@/configs/ABIs/Bridge_ETH.ts';
import { toWei } from '@/helpers/common';
import { TokenType } from '@/store/slices/persistSlice';
type ABIType = typeof ABIBridgeETH;

export type EVMBridgeCtrLockPayload = {
  desAddr: string;
  tkAddr: string;
  amount: string;
  userAddr: string;
  asset: TokenType;
  isNativeToken?: boolean;
};

export type AmountConfigPayload = {
  min: string;
  max: string;
  userAddr: string;
  asset: TokenType;
};

export default class BridgeContract extends Contract<ABIType> {
  constructor({
    address,
    provider,
  }: Omit<InitializeContractType<ABIType>, 'contractABI'>) {
    super({ address, contractABI: ABIBridgeETH, provider });
  }
  lock({
    tkAddr,
    desAddr,
    amount,
    userAddr,
    asset,
    isNativeToken,
  }: EVMBridgeCtrLockPayload) {
    const emitVal = toWei(amount, asset.decimals);
    return this.contractInstance.methods.lock(tkAddr, desAddr, emitVal).send({
      from: userAddr,
      gas: '300000',
      value: isNativeToken ? emitVal : '0',
    });
  }

  setMinMaxAmount({ min, max, userAddr, asset }: AmountConfigPayload) {
    const minAmount = toWei(min, asset.decimals);
    const maxAmount = toWei(max, asset.decimals);
    return this.contractInstance.methods
      .setMinMaxAmount(minAmount, maxAmount)
      .send({
        from: userAddr,
        gas: '300000',
      });
  }

  getMaxAmount() {
    return this.contractInstance.methods.maxAmount().call();
  }
  getMinAmount() {
    return this.contractInstance.methods.minAmount().call();
  }
}
