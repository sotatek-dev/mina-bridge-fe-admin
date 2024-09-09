import { ACCESS_TOKEN } from '@/configs/constants';

export default class StorageUtils {
  static setItem(key: string, value: string) {
    try {
      console.log({ window });
      window?.localStorage?.setItem(key, value);
    } catch (error) {}
  }

  static getItem(key: string, defaultValue: string) {
    try {
      const result = window?.localStorage?.getItem(key);
      if (result === null || result === undefined) return defaultValue;
      return result;
    } catch (error) {}
  }

  static setToken(value = '') {
    StorageUtils.setItem(ACCESS_TOKEN, value);
  }

  static getToken() {
    return StorageUtils.getItem(ACCESS_TOKEN, '');
  }
}
