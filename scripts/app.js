var dropzone = document.querySelector('#dropzone');

dropzone.addEventListener('click', function(e) {

  var accepts = [{
    extensions: ['less']
  }];

  chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function(readOnlyEntry) {
    
    if (!readOnlyEntry) {
      output.textContent = 'No file selected.';
      return;
    }

    chosenFileEntry = readOnlyEntry;

    chosenFileEntry.file(function(file) {
      readAsText(readOnlyEntry, function(result) {
        textarea.value = result;
      });
      // Update display.
      writeFileButton.disabled = false;
      saveFileButton.disabled = false;
      displayPath(chosenFileEntry);
    });
  });
});

var dnd = new DnDFileController('body', function(data) {
  var entry = data.items[0].webkitGetAsEntry();
  chrome.fileSystem.getDisplayPath(entry, function(path) {
    console.log(path)
  });
});

var Lesslie = function () {
  watching = [];
};

Lesslie.prototype.watch = function(fileEntry) {
  watching.add(fileEntry);
};