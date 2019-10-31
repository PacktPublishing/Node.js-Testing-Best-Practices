"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevelEnum;
(function (LogLevelEnum) {
    LogLevelEnum[LogLevelEnum["debug"] = 0] = "debug";
    LogLevelEnum[LogLevelEnum["info"] = 1] = "info";
    LogLevelEnum[LogLevelEnum["warn"] = 2] = "warn";
    LogLevelEnum[LogLevelEnum["error"] = 3] = "error";
})(LogLevelEnum = exports.LogLevelEnum || (exports.LogLevelEnum = {}));
class Logger {
    constructor(logLevel) {
        let theLogLevel = LogLevelEnum[logLevel];
        this.logLevel = theLogLevel;
    }
    getDate() {
        let date = new Date();
        let dStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        return dStr;
    }
    debug(fmt, ...additions) {
        if (this.logLevel > LogLevelEnum.debug) {
            return;
        }
        console.debug(this.getDate() + " [Debug] " + fmt, ...additions);
    }
    info(fmt, ...additions) {
        if (this.logLevel > LogLevelEnum.info) {
            return;
        }
        console.info(this.getDate() + " [Info] " + fmt, ...additions);
    }
    warn(fmt, ...additions) {
        if (this.logLevel > LogLevelEnum.warn) {
            return;
        }
        console.warn(this.getDate() + " [Warn ] " + fmt, ...additions);
    }
    error(fmt, ...additions) {
        if (this.logLevel > LogLevelEnum.error) {
            return;
        }
        console.error(this.getDate() + " [Error] " + fmt, ...additions);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map