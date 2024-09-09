import { useEffect } from 'react';

const getDevice = (userAgent: NavigatorID['userAgent']) => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isLinux = () => Boolean(userAgent.match(/Linux/i));
  const isWindows = () => Boolean(userAgent.match(/Window/i));
  const isSSR = () => Boolean(userAgent.match(/SSR/i));
  return {
    isAndroid,
    isWindows,
    isLinux,
    isIos,
    isSSR,
  };
};
const useOSDetect = () => {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
  return getDevice(userAgent);
};

export default useOSDetect;
