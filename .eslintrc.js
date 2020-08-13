module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
        "indent": 0,
        "semi": 2,
        "linebreak-style": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/ban-types": 0,
        "no-multiple-empty-lines": ["error", {max: 1}],
    }
};
