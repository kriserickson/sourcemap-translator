'use strict';

const { app, BrowserWindow, dialog, crashReporter, ipcMain } = require('electron');
var fs = require('fs');
var path = require('path');
var javascriptFile = '';
var mapFile = '';

crashReporter.start({
	companyName: "fooCorp",
	submitURL: "https://0.0.0.0/",
});

app.allowRendererProcessReuse = true; // hide deprecation warning

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
    mainWindow.loadURL('file://' + __dirname + '/../browser/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

ipcMain.on('get-file', function (event) {
    var openFileOptions = {
        properties: ['openFile'],
        title: 'Select Source Map File',
        filters: [{ name: 'Source Map', extensions: ['map'] }]
    };

    dialog.showOpenDialog(openFileOptions, function (filename) {
        if (filename) {
            filename = filename[0];
            fs.readFile(filename, 'utf-8', function (err, data) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    event.sender.send('get-file-results', { file: filename, map: data });
                }
            });
        }
    });
});

ipcMain.on('get-source-file', function (event, args) {
    var sourceFile = args[0];
    var mapFilename = args[1];
    var sourceDir = path.dirname(mapFilename);
    var resovledPath = path.resolve(sourceDir, sourceFile);
    fs.readFile(resovledPath, 'utf-8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            event.sender.send('get-source-file-result', data);
        }
    });
});
