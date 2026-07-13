export const heroContent = {
  title: 'Template institucional pronto para adaptar ao seu próximo projeto',
  subtitle:
    'Uma base moderna com Next.js para lançar sites estáticos com rapidez, '
    + 'acessibilidade e manutenção simples.',
  primaryCtaLabel: 'Tirar dúvida ou pedir customização',
  secondaryCtaLabel: 'Ver estrutura do template',
} as const;

export const aboutContent = {
  title: 'Por que este boilerplate existe',
  description:
    'Este projeto foi pensado para ser uma base reaproveitável em sites '
    + 'institucionais. Você parte de uma estrutura clara e adapta apenas o conteúdo do cliente.',
  highlights: [
    'Estrutura modular com seções reutilizáveis.',
    'Estilo em SCSS Modules sem dependências utilitárias.',
    'Foco em performance e exportação estática para GitHub Pages.',
    'Base fácil de manter e evoluir em projetos futuros.',
  ],
  noteTitle: 'Sem números inventados',
  noteDescription:
    'Os textos de exemplo descrevem capacidades reais do template. '
    + 'Cada projeto deve trocar esse conteúdo por informações reais da marca.',
} as const;

export interface HomeServiceItem {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export const servicesContent = {
  title: 'Recursos inclusos no template',
  items: [
    {
      title: 'Estrutura pronta para institucional',
      description: 'Seções base de home para apresentar empresa, serviços e contato.',
      icon: '🧱',
    },
    {
      title: 'Padrão visual reutilizável',
      description: 'Componentes em SCSS Modules para adaptar identidade com rapidez.',
      icon: '🎯',
    },
    {
      title: 'Fluxo pronto para deploy',
      description: 'Build estático com CI para publicar no GitHub Pages sem fricção.',
      icon: '🚀',
    },
  ] satisfies readonly HomeServiceItem[],
} as const;
