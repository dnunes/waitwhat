'use strict';

const WWhatWinston = require('./engines/WWhatWinston')
;

let _cache = {};
let waitWhat = {
  'create': function (name, type = 'winston', debugLevel = 'silly') {
    let TClass = (type === 'winston') ? WWhatWinston : null;
    _cache[name] = new TClass(debugLevel);
    return _cache[name];
  },
  'get': function (name) { return _cache[name]; }
};

module.exports = waitWhat;
