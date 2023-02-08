module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  customSyntax: 'postcss-less',
  rules: {
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'number-max-precision': null,
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'keyframes-name-pattern': null,
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'import-notation': null,
    "rule-empty-line-before": null,
    "color-function-notation": null
  },
};
