const appName = import.meta.env.VITE_APP_NAME?.trim() ?? '';

export const env = {
  appName: appName.length > 0 ? appName : 'PrintLab',
} as const;
