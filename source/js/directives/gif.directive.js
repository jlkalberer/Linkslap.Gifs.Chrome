(angular.module('gifSearch', []))
.directive("gif", [
    '$sce',
    function ($sce) {
        return {
            transclude: true,
            scope: {
                'source': '@',
                'thumb': '@'
            },
            restrict: 'E',
            replace: true,
            template:   "<div>" +
                            "<a href='#' ng-click='playing = true; $event.preventDefault();'>" +
                                "<img class='img-responsive' ng-src='{{thumb}}' ng-if='!playing' />" +
                            "</a>" +
                            "<a href='#' ng-click='playing = false; $event.preventDefault();'>" +
                                "<video autoplay='autoplay' preload='auto' loop='loop' ng-if='!loadError && playing'>" +
                                    "<source ng-src='{{mp4}}' type='video/mp4' />" +
                                    "<source ng-src='{{webm}}' type='video/webm' />" +
                                "</video>" +
                                "<div class='gif-image' ng-style='gif' ng-if='loadError && playing'></div>" +
                            "</a>" +
                            "<div ng-transclude></div>" +
                        "</div>",
            link: function (scope, element) {
                scope.playing = false;
                scope.source = scope.source.replace('.gif', '');
                scope.mp4 = $sce.trustAsResourceUrl(scope.source + '.mp4');
                scope.webm = $sce.trustAsResourceUrl(scope.source + '.webm');
                scope.gif = { 'background-image': 'url(' + $sce.trustAsResourceUrl(scope.source + '.gif') + ')' };

                scope.source = $sce.trustAsResourceUrl(scope.source);

                function gifError(e) {
                    scope.loadError = true;
                }
                var player = null;
                scope.$watch('playing', function (val) {
                    if (player) {
                        player.off('error', gifError)
                    }

                    player = angular.element(element.find('source')[1]);
                    player.on('error', gifError);    
                })
            }
        }
    }
]);