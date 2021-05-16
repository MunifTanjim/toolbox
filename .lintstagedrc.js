module.exports = {
  '*.{js,ts}': () => 'tsc -p tsconfig.json --noEmit',
  '*.{js,ts}': ['eslint'],
};
