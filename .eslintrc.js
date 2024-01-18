module.exports = {
  extends: ['./baseLint.js'],
  rules: {
    "max-lines": ["error", { max: 500, skipBlankLines: true }],
  }
};
