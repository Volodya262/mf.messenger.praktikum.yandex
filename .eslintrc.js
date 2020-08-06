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
        "linebreak-style": ["error", "windows"],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/ban-types": 0
    }
};