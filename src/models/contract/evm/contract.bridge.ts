import { MatchPrimitiveType } from 'web3';
import { PayableMethodObject } from 'web3-eth-contract';

import Contract, { InitializeContractType } from './contract';

import ABIBridgeETH from '@/configs/ABIs/evm/Bridge_ETH';
import { formWei, toWei } from '@/helpers/common';
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

export type EVMBridgeTXLock = PayableMethodObject<
  [string, string, MatchPrimitiveType<'uint256', unknown>],
  void
>;

export default class BridgeContract extends Contract<ABIType> {
  constructor({
    address,
    provider,
  }: Omit<InitializeContractType<ABIType>, 'contractABI'>) {
    super({ address, contractABI: ABIBridgeETH, provider });
  }

  buildTxLock({
    tkAddr,
    desAddr,
    amount,
    asset,
  }: Omit<
    EVMBridgeCtrLockPayload,
    'userAddr' | 'isNativeToken'
  >): EVMBridgeTXLock {
    const emitVal = toWei(amount, asset.decimals);
    console.log(
      '🚀 ~ BridgeContract ~ emitVal:',
      emitVal,
      formWei(emitVal, asset.decimals)
    );
    return this.contractInstance.methods.lock(tkAddr, desAddr, emitVal);
  }

  sendTxLock(
    tx: EVMBridgeTXLock,
    {
      amount,
      userAddr,
      asset,
      isNativeToken,
    }: Omit<EVMBridgeCtrLockPayload, 'tkAddr' | 'desAddr'>
  ) {
    const emitVal = toWei(amount, asset.decimals);
    return tx.send({
      from: userAddr,
      gas: '300000',
      value: isNativeToken ? emitVal : '0',
    });
  }

  getMaxAmount() {
    return this.contractInstance.methods.maxAmount().call();
  }
  getMinAmount() {
    return this.contractInstance.methods.minAmount().call();
  }
}
