export const klaroConfig = {
  version: 1,
  elementID: 'klaro',
  noAutoLoad: true, // We manage the UI ourselves
  storageMethod: 'localStorage',
  storageName: 'atzold_cookie_consent_v2',
  services: [
    {
      name: 'marketing-analytics',
      default: false,
      purposes: ['marketing'],
      required: false,
    },
    {
      name: 'functional-prefs',
      default: false,
      purposes: ['functional'],
      required: false,
    }
  ],
};
