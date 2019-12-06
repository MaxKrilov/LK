module.exports = {
  presets: [
    '@vue/app',
    '@vue/babel-preset-jsx'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ]
}
