import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/contact-form';

describe('contactSchema (form validation)', () => {
  it('accepts valid form data', () => {
    const result = contactSchema.safeParse({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      inquiryType: 'template_support',
      message: 'Quero entender como adaptar o template para um cliente.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a name that is too short', () => {
    const result = contactSchema.safeParse({
      name: 'J',
      email: 'joao@exemplo.com',
      inquiryType: 'template_support',
      message: 'Mensagem de teste com mais de 10 caracteres',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path[0] === 'name');
      expect(nameError?.message).toBe('Nome deve ter pelo menos 2 caracteres');
    }
  });

  it('rejects an invalid email address', () => {
    const result = contactSchema.safeParse({
      name: 'João',
      email: 'email-invalido',
      inquiryType: 'template_support',
      message: 'Mensagem de teste com mais de 10 caracteres',
    });
    expect(result.success).toBe(false);
  });

  it('accepts phone as an optional field', () => {
    const result = contactSchema.safeParse({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      inquiryType: 'freelance_project',
      message: 'Mensagem de teste com mais de 10 caracteres',
      phone: '(11) 99999-9999',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an inquiryType outside the allowed list', () => {
    const result = contactSchema.safeParse({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      inquiryType: 'suporte_geral',
      message: 'Mensagem de teste com mais de 10 caracteres',
    });
    expect(result.success).toBe(false);
  });
});
