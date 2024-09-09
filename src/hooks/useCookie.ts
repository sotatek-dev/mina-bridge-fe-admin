export enum COOKIE_SAMESITE_VALUE {
  STRICT = 'strict',
  LAX = 'lax',
}

export type CookieConfigOptions = {
  secure?: boolean;
  ['max-age']?: number;
  expires?: Date | string;
  path?: string;
  domain?: string;
  samesite?: COOKIE_SAMESITE_VALUE;
};

export default function useCookie() {
  function getCookie(name: string): string | undefined {
    if (!document) return undefined;
    let matches = document.cookie.match(
      new RegExp(
        '(?:^|; )' +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
          '=([^;]*)'
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function setCookie(
    name: string,
    value: string,
    options: CookieConfigOptions = {}
  ): boolean {
    if (!document) return false;

    const { expires, ...restOptions } = options;

    const cookieOptions: any = {
      path: options.path || '/',
      ...restOptions,
    };

    if (expires && expires instanceof Date) {
      cookieOptions.expires = expires.toUTCString();
    } else {
      cookieOptions.expires = expires;
    }

    let resultCookie =
      encodeURIComponent(name) + '=' + encodeURIComponent(value);

    Object.entries(cookieOptions).forEach(([key, value]) => {
      resultCookie += '; ' + key;
      if (value !== true) resultCookie += '=' + value;
    });

    document.cookie = resultCookie;
    return true;
  }
  function deleteCookie(name: string): boolean {
    return setCookie(name, '', {
      'max-age': -1,
    });
  }

  return { getCookie, setCookie, deleteCookie };
}
