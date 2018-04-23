var tab = document.getElementById('astro-tabs-1-panel-0');
var input = document.getElementsByClassName('askt-utterance__input')[0];

var snippet = document.createElement("div");
snippet.classList.add('snippets');

chrome.storage.sync.get({
    snippets: []
}, function (items) {
    items.snippets.forEach(function (snippetText) {
        snippet.innerHTML = snippet.innerHTML + '<span class="snippet">' + snippetText + '</span>';
    });
    tab.insertBefore(snippet, tab.firstChild);

    var snippets = document.getElementsByClassName('snippet');

    Array.from(snippets).forEach(function(element) {
        element.addEventListener('click', function () {
            let lastValue = input.value;
            input.value = this.innerText;
            // @see https://github.com/facebook/react/issues/11488
            let event = new Event('change', { bubbles: true });
            event.simulated = true;
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);
            input.focus();
        });
    });
});

