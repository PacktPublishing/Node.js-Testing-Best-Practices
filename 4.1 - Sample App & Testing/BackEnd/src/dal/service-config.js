"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class ServiceConfig extends events_1.EventEmitter {
    configurationChanged() {
        this.emit("changed");
    }
}
exports.ServiceConfig = ServiceConfig;
//# sourceMappingURL=service-config.js.map