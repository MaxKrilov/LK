module.exports = {
  verbose: true,
  preset: 'ts-jest',
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  }
}
