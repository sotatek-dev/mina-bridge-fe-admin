export const ACCESS_TOKEN = 'token_access';
export const HOOK_CACHE_FILE_NAMES = [
  'lagrange-basis-fp-1024',
  'lagrange-basis-fp-2048',
  'lagrange-basis-fp-4096',
  'srs-fp-65536',
  'srs-fq-32768',
  'step-vk-hooks-canadmin',
  'step-vk-hooks-initialize',
  'wrap-vk-hooks',
];
export const TOKEN_CACHE_FILE_NAMES = [
  'lagrange-basis-fp-1024',
  'lagrange-basis-fp-2048',
  'lagrange-basis-fp-16384',
  'srs-fp-65536',
  'srs-fq-32768',
  'step-vk-fungibletoken-approvebase',
  'step-vk-fungibletoken-burn',
  'step-vk-fungibletoken-getbalanceof',
  'step-vk-fungibletoken-getcirculating',
  'step-vk-fungibletoken-getdecimals',
  'step-vk-fungibletoken-getsupply',
  'step-vk-fungibletoken-mint',
  'step-vk-fungibletoken-setowner',
  'step-vk-fungibletoken-setsupply',
  'step-vk-fungibletoken-transfer',
  'wrap-vk-fungibletoken',
];

export const BRIDGE_CACHE_FILE_NAME = [
  'lagrange-basis-fp-1024',
  'lagrange-basis-fp-2048',
  'lagrange-basis-fp-16384',
  'srs-fp-65536',
  'srs-fq-32768',
  'step-vk-bridge-config',
  'step-vk-bridge-decrementbalance',
  'step-vk-bridge-lock',
  'step-vk-bridge-unlock',
  'wrap-vk-bridge',
];

export enum ZkContractType {
  HOOK = 'Hook',
  BRIDGE = 'Bridge',
  TOKEN = 'TOKEN',
}

export const ListFileName = {
  [ZkContractType.BRIDGE]: BRIDGE_CACHE_FILE_NAME,
  [ZkContractType.HOOK]: HOOK_CACHE_FILE_NAMES,
  [ZkContractType.TOKEN]: TOKEN_CACHE_FILE_NAMES,
};
