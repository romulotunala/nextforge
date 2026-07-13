import { z } from 'zod/v4';

export const inquiryTypes = [
  'template_support',
  'freelance_project',
  'cms_integration',
  'other',
] as const;

export const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.email('E-mail inválido'),
  phone: z.string().optional(),
  inquiryType: z.enum(inquiryTypes),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type SubmitStatus = 'idle' | 'success' | 'error';

export const DEFAULT_INQUIRY_TYPE: (typeof inquiryTypes)[number] = 'template_support';

export const defaultContactValues: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  inquiryType: DEFAULT_INQUIRY_TYPE,
  message: '',
};

export const inquiryTypeLabels: Record<(typeof inquiryTypes)[number], string> = {
  template_support: 'Dúvida sobre o template',
  freelance_project: 'Quero contratar customização',
  cms_integration: 'Integração com CMS',
  other: 'Outro assunto',
};

export function isValidFormspreeEndpoint(endpoint: string): boolean {
  try {
    const parsedUrl = new URL(endpoint);
    const hasValidHost = parsedUrl.hostname === 'formspree.io';
    // Precisa existir um id de formulário após o prefixo '/f/'.
    const hasFormId = parsedUrl.pathname.startsWith('/f/')
      && parsedUrl.pathname.length > '/f/'.length;

    return hasValidHost && hasFormId;
  } catch {
    return false;
  }
}

export function mapFormspreeError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes('isn\'t set up yet') || normalized.includes('not set up')) {
    return 'Seu form no Formspree ainda não foi ativado. '
      + 'Abra o painel do Formspree e finalize o setup do formulário.';
  }

  if (normalized.includes('invalid') && normalized.includes('email')) {
    return 'O Formspree recusou o e-mail informado. Revise o campo e tente novamente.';
  }

  if (normalized.includes('too many requests') || normalized.includes('rate limit')) {
    return 'Limite de envios atingido temporariamente. Aguarde um pouco e tente novamente.';
  }

  if (normalized.includes('forbidden') || normalized.includes('unauthorized')) {
    return 'O endpoint do Formspree não tem permissão para este formulário. '
      + 'Verifique a configuração no painel.';
  }

  return 'Não foi possível enviar agora. '
    + 'Verifique a configuração do Formspree e tente novamente.';
}
