module.exports = {
  extends: ['./baseLint.js'],
  ignorePatterns: ['**/dist/**'],
  rules: {
    "max-lines": ["error", { max: 500, skipBlankLines: true }],
  }
};
