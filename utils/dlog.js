const fs = require('fs');
const path = require('path');
const util = require('util');

class DLog {
    static async log(msg) {
        console.log('DLOG log');
        const date = new Date();
        const date_str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const file = path.join(__dirname, 'logs.txt');
        const data = `${date_str} - ${msg}\n`;
        fs.appendFile(file, data, (err) => {
            if (err) throw err;
        } );
    }

    static async error(msg) {
        console.log('DLOG error');
        const date = new Date();
        const date_str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const file = path.join(__dirname, 'logs_error.txt');
        const data = `${date_str} - ${msg}\n`;
        fs.appendFile(file, data, (err) => {
            if (err) throw err;
        } );
    }

    // Debug all error streams to 
    static async debug_error() {
        console.log('DLOG debug error only');
        // create a write stream (file descriptor)

        var access = fs.createWriteStream(path.join(__dirname, 'logs_error.txt'), {flags: 'a'});
        process.stderr.write = access.write.bind(access);

        // Print to error.log when a fatal error is thrown
    }

    static async debug_logs() {
        console.log('DLOG debug logs');
        // create a write stream (file descriptor)
        var access = fs.createWriteStream(path.join(__dirname, 'logs.txt'), {flags: 'a'});
        process.stdout.write = access.write.bind(access);
    }

    static async debug_all() {
        console.log('DLOG debug all');
        // create a write stream (file descriptor)

        var access = fs.createWriteStream(path.join(__dirname, 'logs.txt'), {flags: 'a'});
        process.stdout.write = process.stderr.write = access.write.bind(access);
    }
}

module.exports = DLog;