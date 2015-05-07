'use strict';

class SourceMapCtrl {
    constructor() {
        this.minifiedSourceFile = '';
        this.sourceMapFile = '';
        this.testVal = 'Something';
    }
    getMinifiedJavascriptFile() {
        console.log('getMinifiedJSFile');
        dialog.showOpenDialog({
            title: 'Select Minified Javascript File',
            filters: [ {name: 'Javascript', extensions: ['js']}],
            properties: ['openFile']
        }, function(filename) {
            this.minifiedSourceFile = filename;
        });
    }
    getSourceMapFile() {
        console.log('getSourceMapFile');
        dialog.showOpenDialog({
            title: 'Select Source Map File',
            filters: [ {name: 'Source Map', extensions: ['map']}],
            properties: ['openFile']
        }, function(filename) {
            this.sourceMapFile = filename;
        });
    }
}
export { SourceMapCtrl };