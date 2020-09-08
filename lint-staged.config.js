module.exports = {
  "*.{js,ts}": [
    "eslint --cache --ext .js,.ts --fix",
    "prettier --write",
    "git add",
  ],
  "*.{md,yaml,yml,json}": ["prettier --write", "git add"],
  "*.{md}": ["remark --quiet --frail"],
};
