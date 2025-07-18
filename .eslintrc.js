module.exports = {
  extends: ["next/core-web-vitals", "plugin:storybook/recommended"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "react/no-unescaped-entities": 0,
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "no-multi-spaces": ["error"]
  },
};
