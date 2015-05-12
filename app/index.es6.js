let app = require('app');
let BrowserWindow = require('browser-window');
let dialog = require('dialog');
let fs = require('fs');
let path = require('path');
let javascriptFile = '';
let mapFile = '';

require('crash-reporter').start();

let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadUrl('file://' + __dirname + '/../browser/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

});

let ipc = require('ipc');

ipc.on('get-file', (event) => {
    let openFileOptions = {
        properties: ['openFile'],
        title: 'Select Source Map File',
        filters: [{name: 'Source Map', extensions: ['map']}]
    };

    dialog.showOpenDialog(openFileOptions, function (filename) {
        if (filename) {
            filename = filename[0];
            fs.readFile(filename, 'utf-8', function (err, data) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    event.sender.send('get-file-results', {file: filename, map: data});
                }
            });
        }
    });

});

ipc.on('get-source-file', (event, args) => {
    let sourceFile = args[0];
    let mapFilename = args[1];
    let sourceDir = path.dirname(mapFilename);
    let resovledPath = path.resolve(sourceDir, sourceFile);
    fs.readFile(resovledPath, 'utf-8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            event.sender.send('get-source-file-result', data);
        }
    });
});

