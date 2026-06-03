// logging_middleware/logger.js
const fs = require('fs');
const path = require('path');

function log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] - ${message}`;

    // We use standard console.log here because this IS the custom middleware.
    console.log(logMessage);

    // Also write logs to a file for persistent tracking
    const logFile = path.join('d:', 'projects', '2330249', 'logging_middleware', 'app.log');
    fs.appendFileSync(logFile, logMessage + '\n');
}

module.exports = {
    info: (msg) => log('info', msg),
    warn: (msg) => log('warn', msg),
    error: (msg) => log('error', msg)
};
