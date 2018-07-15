'use strict';

class WaitWhat {
  constructor() {
    this._globalCB = null;
    this._levelCBs = {};
  }

  error(msg, args, debugData) { this.log('error', msg, args, debugData); }
  warn(msg, args, debugData) { this.log('warn', msg, args, debugData); }
  info(msg, args, debugData) { this.log('info', msg, args, debugData); }
  verbose(msg, args, debugData) { this.log('verbose', msg, args, debugData); }
  debug(msg, args, debugData) { this.log('debug', msg, args, debugData); }
  silly(msg, args, debugData) { this.log('silly', msg, args, debugData); }

  measure() { return new Date(); }

  setLevelCallback(level, cb) { this._levelCBs[level] = cb; }
  setGlobalCallback(cb) { this._globalCB = cb; }
  log(level, msg, args, debugData) {
    let xtra = {}, hasX = false;
    if (args) {
      Object.entries(args).forEach(([key, v]) => {
        if (key[0] === '_') { return false; }
        xtra[key] = v;
        return (hasX = true);
      });
    }
    if (!hasX) { xtra = false; }

    if (debugData) {
      Object.entries(debugData).forEach(([key, v]) => {
        if (v instanceof Error) {
          debugData[key] = JSON.parse(
            JSON.stringify(v, Object.getOwnPropertyNames(v))
          );
        }
      });
    }

    if (this._globalCB) { this._globalCB(level, msg, args, xtra, debugData); }
    if (this._levelCBs[level]) { this._levelCBs[level](msg, args, xtra, debugData); }
    this._log(level, msg, args, xtra, debugData);
  }

  _log(level, msg, args, xtra/*, debugData*/) {
    xtra = (xtra) ? ` ${JSON.stringify(xtra)}` : '';
    console.log('['+ level[0] +'] '+ msg + xtra);
  }
}

module.exports = WaitWhat;
