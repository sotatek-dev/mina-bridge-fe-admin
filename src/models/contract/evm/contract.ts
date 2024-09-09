import type { ContractAbi as ContractABIType } from "web3";
import { type Contract as ContractType } from "web3";

import { getWeb3Instance } from "@/helpers/evmHandlers";
import { WALLET_INJECT_OBJ } from "@/models/wallet/wallet.abstract";

export enum PROVIDER_TYPE {
  WALLET = 'wallet',
  HTTPS = 'https',
  HTTP = 'http',
}

export type ProviderType =
  | { type: PROVIDER_TYPE.WALLET; injectObject: WALLET_INJECT_OBJ }
  | { type: PROVIDER_TYPE.HTTPS | PROVIDER_TYPE.HTTP; uri: string };

export type InitializeContractType<T> = {
  address: string;
  contractABI: T;
  provider: ProviderType;
};

export default class Contract<T extends ContractABIType> {
  address: string;
  provider: ProviderType;
  contractABI: T;
  contractInstance: ContractType<T>;

  constructor({ address, contractABI, provider }: InitializeContractType<T>) {
    this.address = address;
    this.contractABI = contractABI;
    this.provider = provider;
    const web3Instance = getWeb3Instance(provider);

    this.contractInstance = new web3Instance.eth.Contract(contractABI, address);
  }
}
