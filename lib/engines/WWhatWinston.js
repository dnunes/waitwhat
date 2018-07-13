'use strict';

const utils = require('simpleutils')
, WaitWhat = require('./base/WaitWhat.js')
, winston = require('winston')
;

const _autoColors = {
  'silly': 'magenta',
  'warn': 'yellow_bg+black+bold',
  'error': 'red+bold'
};
class WWhatWinston extends WaitWhat {
  constructor(debugLevel = 'silly') {
    super();
    this._logger = winston.createLogger({
      level: debugLevel,
      format: winston.format.combine(
        winston.format.printf(this._format.bind(this))
      ),
      transports: [new winston.transports.Console()]
    });
  }
  _log(level, msg, args, xtra, debugData) {
    this._logger.log({'message': msg, level, ...args, xtra, debugData});
  }

  _colorDelay(delay) { /* eslint-disable brace-style */
    let color = 'white';
    if (delay <= 7) { color = 'green'; }
    else if (delay <= 20) { color = 'white'; }
    else if (delay <= 50) { color = 'yellow'; }
    else { color = 'white+red_bg'; } /* eslint-enable brace-style */
    return `{{${delay}|${color}}}`;
  }
  _format(info) {
    let date = new Date();
    let dy = String(date.getFullYear()).slice(-2);
    let dm = String(date.getMonth()).padStart(2, 0);
    let dd = String(date.getDate()).padStart(2, 0);
    let h = String(date.getHours() +1).padStart(2, 0);
    let m = String(date.getMinutes()).padStart(2, 0);
    let s = String(date.getSeconds()).padStart(2, 0);
    let ms = String(date.getMilliseconds()).padStart(3, 0);
    let ts = `${dy}-${dm}-${dd} ${h}:${m}:${s}.${ms}`;

    let diffM = '';
    let levelM = '';
    let xtraM = '';

    if (info._timing) {
      let diff = (date.getTime() -info._timing);
      diff = this._colorDelay(String(diff).padStart(3, 0));
      diffM = `[${diff}ms]`;
    }

    if (!info._hidelevel) { levelM = `[${info.level[0]}]`; }
    if (info.xtra) { xtraM = ` ${JSON.stringify(info.xtra)}`; }

    let color = false;
    if (_autoColors[info.level]) { color = _autoColors[info.level]; }
    if (info._color) { color = info._color; }
    return utils.format(
      `[${ts}]${levelM}${diffM}: ${info.message}${xtraM}`, color
    );
  }
}

module.exports = WWhatWinston;
