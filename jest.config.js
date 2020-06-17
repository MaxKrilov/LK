module.exports = {
  verbose: true,
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  }
}
