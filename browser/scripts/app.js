import angular from 'angular';
import { SourceMapCtrl } from './controller';

angular.module('sourceMapApp', [])
        .controller('sourceMapCtrl', SourceMapCtrl)
        .directive('nagPrism', ['$window', ($window) => {
            return {
                restrict: 'A',
                scope: {
                    source: '@'
                },
                link: (scope, element) => {

                    function setElementHeight() {
                        let top = element[0].getBoundingClientRect().top;
                        let newHeight = $window.innerHeight - top - 30;
                        element.css('height', newHeight + 'px');
                    }

                    // Set the new element height when the window resizes
                    scope.$watch(() => { return $window.innerHeight; }, setElementHeight);

                    window.onresize = () => {
                        console.log('Window resize');
                        scope.$apply();
                    };

                    scope.$watch('source', (v) => {
                        if (v) {
                            Prism.highlightElement(element.find("code")[0]);
                            setTimeout(function() {
                                document.querySelector('#codeView .line-highlight').scrollIntoView();
                            }, 50);
                        }
                    });

                    setElementHeight();
                },
                template: "<code ng-bind='source'></code>"
            };

        }]);
