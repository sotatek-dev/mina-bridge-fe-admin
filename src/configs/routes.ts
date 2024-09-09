enum ROUTES {
  HOME = '/',
  PROOF_OF_ASSETS = '/proof-of-asset',
  USER_GUIDE = '/user-guide',
  INTERNAL_ERROR = '/error_500',
  HISTORY = '/history',
}

export const PROTECTED_ROUTES = [ROUTES.HISTORY];

export default ROUTES;
