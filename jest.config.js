const {defaults} = require('jest-config');

crypto = require('@trust/webcrypto')

module.exports = {
    testEnvironment: 'jsdom'
};