export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    // Permite camelCase em CSS Modules (ex: .cardTitle, .statNumber)
    'selector-class-pattern': null,
    // Permite variáveis Sass agrupadas sem linha em branco obrigatória
    'scss/dollar-variable-empty-line-before': null,
    // Permite at-rules (@use, @include) encadeadas sem linha em branco
    'at-rule-empty-line-before': null,
    // Permite vendor prefixes necessários para compatibilidade
    'property-no-vendor-prefix': null,
  },
};
