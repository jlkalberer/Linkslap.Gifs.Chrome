angular.module('linkslapGifSearch')
.controller('SearchCtrl', [
	'$scope', 'Restangular',
	function($scope, rest) {
		$scope.getUrl = function (url) {
			return chrome.extension.getURL(url)
		}

		$scope.submitForm = function () {
            if (!$scope.query || $scope.query === "") {
                $scope.searchResults = null;
                return;
            }

            rest.oneUrl('linkslap', 'https://linkslap.me/api/gifs/search').get({ "query": $scope.query, 'page': 0, 'pageSize': 50 }).then(function (result) {
                $scope.searchResults = result.results;

                setTimeout(function () {
                    chrome.runtime.sendMessage({action: "resize", height: window.document.body.offsetHeight });
                },1);
            });
        };
        
        $scope.close = function () {
            chrome.runtime.sendMessage({ action: "close" });
        };

        $scope.sendGif = function (result) {
            chrome.runtime.sendMessage({ action: "insert", url: result.url + "v" });
        };

        $scope.copy = function (result) {
            chrome.runtime.sendMessage({ action: "copy", url: result.url + "v" });
        };

        chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.action === "focus") {
                setTimeout(function () {
                    document.getElementById('searchInput').focus();
                }, 0);
            }
        });
	}]);