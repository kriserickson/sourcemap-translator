let app = require('app');
let BrowserWindow = require('browser-window');
let dialog = require('dialog');
let fs = require('fs');
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
ipc.on('get-file', (event, arg) => {
    let openFileOptions = {
        properties: ['openFile']
    };
    if (arg == 'javascript') {
        openFileOptions.title = 'Select Minified Javascript File';
        openFileOptions.filters = [{name: 'Javascript', extensions: ['js']}];
    } else {
        openFileOptions.title = 'Select Source Map File';
        openFileOptions.filters = [{name: 'Source Map', extensions: ['map']}];
    }

    dialog.showOpenDialog(openFileOptions, (filename) => {
        filename = filename[0];
        event.sender.send('get-file-results', filename);
        fs.readFile(filename, (err, data) => {
            if (arg == 'javscript') {
                javascriptFile = data;
            } else {
                mapFile = data;
            }
        });
    });

});

ipc.on('get-javascript-map', (event) => {
    event.returnValue = {map: mapFile, script: javascriptFile};
});

