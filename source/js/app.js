angular.module('linkslapGifSearch', [ 'restangular', 'gifSearch' ])
.config( [
    '$compileProvider',
    function ($compileProvider) {   
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
    }
]);