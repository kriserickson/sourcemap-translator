'use strict';
var ipc = require('ipc');

class SourceMapCtrl {
    constructor($scope) {
        this.minifiedSourceFilename = '';
        this.sourceMapFilename = '';
        this.minifiedSource = false;
        this.sourceMap = false;
        this.currentGet = '';
        ipc.on('get-file-results', (file) => {
            if (this.currentGet === 'javascript') {
                this.minifiedSourceFilename = file;
            } else {
                this.sourceMapFilename = file;
            }
            $scope.$apply();
        });
    }

    getMinifiedJavascriptFile() {
        this.currentGet = 'javascript';
        ipc.send('get-file', 'javascript');
    }
    getSourceMapFile() {
        this.currentGet = 'map';
        ipc.send('get-file', 'map');
    }
    showVisualizer() {
        let res = ipc.sendSync('get-javascript-map');
        this.sourceMap = res.map;
        this.minifiedSource = res.script;
        this.visualizerSelected = true;
    }

}
export { SourceMapCtrl };