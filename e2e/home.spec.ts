import { test, expect } from '@playwright/test';

test.describe('Home page smoke tests', () => {
  test('loads the home page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/nextforge/i);
  });

  test('displays the hero section with a heading', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByRole('region', { name: 'Apresentação principal' });
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('displays the services section', async ({ page }) => {
    await page.goto('/');
    const services = page.getByRole('region', { name: 'Recursos do template' });
    await expect(services).toBeVisible();
  });

  test('displays the contact form with required fields', async ({ page }) => {
    await page.goto('/');
    const form = page.getByRole('region', { name: 'Formulário de contato' });
    await expect(form).toBeVisible();
    await expect(form.getByLabel('Nome')).toBeVisible();
    await expect(form.getByLabel('E-mail')).toBeVisible();
    await expect(form.getByLabel('Mensagem')).toBeVisible();
  });
});
