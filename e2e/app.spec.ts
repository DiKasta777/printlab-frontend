import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('production-сборка открывает PrintLab без ошибок JavaScript', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');

  await expect(page).toHaveTitle('PrintLab');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ваше пространство');
  await expect(page.getByText('Приложение в разработке')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('прямая ссылка на неизвестный маршрут открывает 404 и возврат домой', async ({ page }) => {
  await page.goto('/unknown-page');
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.getByRole('link', { name: 'На главную' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ваше пространство');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
