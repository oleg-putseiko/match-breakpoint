/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  extends: [
    'woofmeow',
    'woofmeow/import-atomic',
    'woofmeow/typescript',
    'woofmeow/react',
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
