
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
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
            Lesslie.watch(event.dataTransfer.items[i].webkitGetAsEntry());
        };
        $scope.state = '';
        $scope.$apply();
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
        // Properties.
        this.watching = [];
        // Inner class.
        this.FileEntry = function (fileEntry) {
            this.fileEntry = fileEntry;
            var $this = this;
            this.fileEntry.getMetadata(function(metadata) {
                $this.state = metadata.modificationTime + '_' + metadata.size;
            }, function(err) {
                console.error(err);
            });
        };
        this.FileEntry.prototype.hasChanged = function(callback) {
            var $this = this;
            this.fileEntry.getMetadata(function(metadata) {
                var currentState = metadata.modificationTime + '_' + metadata.size,
                    changed = $this.state != currentState;
                if (changed) {
                    $this.state = currentState;
                }
                callback(changed, null);
            }, function(err) {
                callback(false, err);
            });
        };
    };

    /**
     * Watch an entry
     * 
     * @param entry - A {FileEntry} object.
     */
    Lesslie.prototype.watch = function(entry) {
        if (entry.isFile) {
            watchFile.apply(this, [new this.FileEntry(entry)]);
        }
    };

    // Private functions //

    function watchFile(fileEntry) {
        this.watching.push(fileEntry);
    }

    function checkForModifications() {
        if (this.watching.length > 0) {
            this.watching[0].hasChanged(function(changed, err) {
                if (changed) {
                    console.log('File changed!');
                }
            });
        }
    }

    // Expose class as global.

    window.Lesslie = new Lesslie();

    // Initialize file watcher.

    setInterval(function() {
        checkForModifications.apply(window.Lesslie, []);
    }, 500);

})(window);