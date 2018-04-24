var snippets = [];

var historyButton = document.getElementById('reset-history');
historyButton.addEventListener('click', function () {
    chrome.storage.sync.set({
        commandHistory: []
    })
});

function saveSnippet() {
    console.log(snippets);
    chrome.storage.sync.set({
        snippets: snippets
    });
}

function restoreOptions() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        snippets: []
    }, function (items) {
        var container = document.getElementById('snippets');
        snippets = items.snippets;
        items.snippets.forEach(function (snippet) {
            addSnippet(snippet);
        });
        var row = '<div class="input-group mb-3">\n' +
            '  <input type="text" class="form-control" id="snippet-value" placeholder="Snippet" aria-label="Snippet" aria-describedby="basic-addon1">\n' +
            '  <div class="input-group-append">\n' +
            '    <button class="btn btn-outline-primary" id="add" type="button"><i class="fa fa-plus"></i></button>\n' +
            '  </div>\n' +
            '</div>';
        container.innerHTML = container.innerHTML + row;
        setAddHandler();
        setRemoveHandler();
        setChangeHandler();
    });
}

function addSnippet(snippet, save = false) {
    var container = document.getElementById('snippets');
    var row = '<div class="input-group mb-3">\n' +
        '  <input type="text" data-snippet="' + snippet + '" value="'+ snippet +'" class="form-control snippet-content" placeholder="Snippet" aria-label="Snippet" aria-describedby="basic-addon1">\n' +
        '  <div class="input-group-append">\n' +
        '    <button data-snippet="' + snippet + '" class="btn btn-outline-danger remove-snippet" type="button"><i class="fa fa-trash"></i></button>\n' +
        '  </div>\n' +
        '</div>';
    container.innerHTML = row + container.innerHTML;
    if (save) {
        snippets.push(snippet);
        saveSnippet();
        setAddHandler();
        setRemoveHandler();
        setChangeHandler();
    }
}

function setRemoveHandler() {
    var snippetInputs = document.getElementsByClassName('remove-snippet');
    Array.from(snippetInputs).forEach(function(element) {
        element.addEventListener('click', function () {
            var index = snippets.indexOf(this.getAttribute('data-snippet'));
            if (index > -1) {
                snippets.splice(index, 1);
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                saveSnippet();
            }
        });
    });
}

function setAddHandler() {
    document.getElementById('add').addEventListener('click', function (event) {
        var snippetInput = document.getElementById('snippet-value');
        if (snippetInput.value !== '') {
            addSnippet(snippetInput.value, true);
        }
    });
}

function setChangeHandler() {
    var snippetInputs = document.getElementsByClassName('snippet-content');
    Array.from(snippetInputs).forEach(function(element) {
        element.addEventListener('change', function () {
            var index = snippets.indexOf(this.getAttribute('data-snippet'));
            if (index > -1) {
                snippets[index] = this.value
                this.setAttribute('data-snippet', this.value);
                saveSnippet();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);