module.exports = {
    linters: {
        '**/*.+(ts)': [
            'eslint --fix',
            'git add',
        ],
    },
};
