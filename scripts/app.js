
// Init //

jQuery(function($) {

    var screen = {
        content : $('#content'),
        dropzone : $('#dropzone'),
        watchList : $('#watch-list')
    };

    screen.dropzone.appendTo(screen.content).show();

});

// Controllers //

var App = angular.module('App', []);

App.directive('droppable', function() {
    return {
        restrict: 'A',
        link : function (scope, element, attrs) {
            var el = element[0];
            el.addEventListener('dragenter', scope.dragenter, false);
            el.addEventListener('dragover', scope.dragover, false);
            el.addEventListener('dragleave', scope.dragleave, false);
            el.addEventListener('drop', scope.drop, false);
        }
    };
});

App.controller('DropZoneCtrl', ['$scope', function ($scope) {

    $scope.chooseFile = function() {

        var accepts = [{
            extensions: ['less']
        }];

        chrome.fileSystem.chooseEntry({
            type: 'openFile', 
            accepts: accepts
        }, function(readOnlyEntry) {
            if (readOnlyEntry) {
                Lesslie.watch(readOnlyEntry);
            }
        });
    };

    $scope.dragenter = function(event) {
        event.stopPropagation();
        event.preventDefault();
        $scope.state = 'enter';
        $scope.$apply();
    };

    $scope.dragover = function(event) {
        event.stopPropagation();
        event.preventDefault();
        $scope.state = 'enter';
        $scope.$apply();
    };

    $scope.dragleave = function(event) {
        event.stopPropagation();
        event.preventDefault();
        $scope.state = '';
        $scope.$apply();
    };

    $scope.drop = function(event) {
        event.stopPropagation();
        event.preventDefault();
        $scope.state = '';
        $scope.$apply();
        Lesslie.watch(event.dataTransfer.files);
    };

}]);

// Functions //

function errorHandler(e) {
    console.error(e);
}

function readAsText(fileEntry, callback) {
    fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onerror = errorHandler;
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsText(file);
    });
}

// Lesslie Class definition //

(function(window) {
  
    var Lesslie = function () {
        this.watching = [];
    };

    Lesslie.prototype.watch = function(entries) {

        if (!entries) {
            return;
        } else if (entries.toString() == '[object FileList]') {
            for (var i = 0; i < entries.length; i++) {
                this.watching.push(entries[i]);
            }
        } else if (typeof entries === 'string') {
            this.watching.push(entries);
        }
    };

    // Private functions //

    function watchFile(file) {
        
    }

    window.Lesslie = new Lesslie();

})(window);