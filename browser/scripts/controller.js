// Allow debugging in browser...
if (typeof require != 'undefined') {
    var ipc = require('ipc');
}

import SourceMap from 'source-map';
let SourceMapConsumer = SourceMap.SourceMapConsumer;

class SourceMapCtrl {
    constructor($scope) {
        this.$scope = $scope;
        this.sourceMapFilename = '';
        this.smc = false;
        var self = this;

        function showColumnLine() {
            if (self.line && self.column) {

                var res = self.smc.originalPositionFor({line: self.line, column: self.column});
                // res = {source: "../RecipeFolder/app/js/topcoat-touch.js", line: 121, column: 10};
                self.loading = true;
                ipc.send('get-source-file', [res.source, self.sourceMapFilename]);
                ipc.on('get-source-file-result', (sourceCode) => {
                    self.code = sourceCode;
                    self.lineResult = res.line;
                    self.sourceFilename = res.source;   // TODO: Get just the filename
                    self.loading = false;
                    self.$scope.$apply();
                })
            }
        }

        $scope.$watch(() => {
            return self.line;
        }, showColumnLine);

        $scope.$watch(() => {
            return self.column;
        }, showColumnLine);


    }

    getSourceMapFile() {
        ipc.send('get-file', 'map');
        ipc.on('get-file-results', (res) => {
            this.sourceMapFilename = res.file;
            this.smc = new SourceMapConsumer(res.map);
            this.$scope.$apply();
        });

    }


}
export { SourceMapCtrl };