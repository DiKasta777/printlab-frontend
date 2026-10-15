import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('Настройки окружения', () => {
  it('использует PrintLab по умолчанию', async () => {
    vi.stubEnv('VITE_APP_NAME', undefined);
    const { env } = await import('./env');
    expect(env.appName).toBe('PrintLab');
  });

  it('удаляет пробелы у заданного имени', async () => {
    vi.stubEnv('VITE_APP_NAME', '  PrintLab Dev  ');
    const { env } = await import('./env');
    expect(env.appName).toBe('PrintLab Dev');
  });

  it('использует значение по умолчанию для пустого имени', async () => {
    vi.stubEnv('VITE_APP_NAME', '   ');
    const { env } = await import('./env');
    expect(env.appName).toBe('PrintLab');
  });
});
