'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var dialog = require('dialog');
var fs = require('fs');
var javascriptFile = '';
var mapFile = '';

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadUrl('file://' + __dirname + '/../browser/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

var ipc = require('ipc');
ipc.on('get-file', function (event, arg) {
    var openFileOptions = {
        properties: ['openFile']
    };
    if (arg == 'javascript') {
        openFileOptions.title = 'Select Minified Javascript File';
        openFileOptions.filters = [{ name: 'Javascript', extensions: ['js'] }];
    } else {
        openFileOptions.title = 'Select Source Map File';
        openFileOptions.filters = [{ name: 'Source Map', extensions: ['map'] }];
    }

    dialog.showOpenDialog(openFileOptions, function (filename) {
        filename = filename[0];
        event.sender.send('get-file-results', filename);
        fs.readFile(filename, function (err, data) {
            if (arg == 'javscript') {
                javascriptFile = data;
            } else {
                mapFile = data;
            }
        });
    });
});

ipc.on('get-javascript-map', function (event) {
    event.returnValue = { map: mapFile, script: javascriptFile };
});