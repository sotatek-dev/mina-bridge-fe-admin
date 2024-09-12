enum ROUTES {
  HOME = '/',
  INTERNAL_ERROR = '/error_500',
  HISTORY = '/history',
  CONFIGURATION = '/configuration',
}

export const PROTECTED_ROUTES = [ROUTES.HISTORY, ROUTES.CONFIGURATION];

export default ROUTES;
