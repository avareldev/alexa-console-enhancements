var tab = document.getElementById('astro-tabs-1-panel-0');
var input = document.getElementsByClassName('askt-utterance__input')[0];
var inputDiv = document.getElementsByClassName('askt-simulator__input')[0];
var autoSubmitChechboxContainer = document.createElement("div");
autoSubmitChechboxContainer.classList.add('auto-submit-checkbox-container');

autoSubmitChechboxContainer.innerHTML = '<label for="auto-submit">Auto:</label><div><input type="checkbox" id="auto-submit" value="1"></div>';
inputDiv.appendChild(autoSubmitChechboxContainer);
var autoSubmit = document.getElementById('auto-submit');

var snippet = document.createElement("div");
snippet.classList.add('snippets');

var commandHistory = [];
var currentPosition = 0;

chrome.storage.sync.get({
    snippets: [],
    commandHistory: [],
    auto: false
}, function (items) {
    commandHistory = items.commandHistory;
    currentPosition = commandHistory.length;

    autoSubmit.checked = items.auto;
    autoSubmit.addEventListener('click', function (e) {
        chrome.storage.sync.set({
            auto: this.checked
        });
    });

    items.snippets.forEach(function (snippetText) {
        snippet.innerHTML = snippet.innerHTML + '<span class="snippet">' + snippetText + '</span>';
    });
    tab.insertBefore(snippet, tab.firstChild);

    var snippets = document.getElementsByClassName('snippet');

    Array.from(snippets).forEach(function(element) {
        element.addEventListener('click', function () {
            setInputValue(this.innerText);
            if (autoSubmit.checked) {
                addHistoryEntry(this.innerText);
                var e = new KeyboardEvent("keypress", {bubbles : true, keyCode : 13});
                e.simulated = true;
                input.dispatchEvent(e);
            }
        });
    });

    input.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 38:
                if (currentPosition > 0 && commandHistory.length > 0) {
                    currentPosition--;
                    setInputValue(commandHistory[currentPosition]);
                }
                break;
            case 40:
                if (currentPosition < commandHistory.length - 1 && commandHistory.length > 0) {
                    currentPosition++;
                    setInputValue(commandHistory[currentPosition]);
                } else {
                    setInputValue('');
                    currentPosition = commandHistory.length;
                }
                break;
            case 13:
                if (this.value !== '') {
                    addHistoryEntry(this.value);
                }
                break;
        }
    });
});

function addHistoryEntry(entry) {
    commandHistory.push(entry);
    currentPosition = commandHistory.length;
    chrome.storage.sync.set({
        commandHistory: commandHistory
    });
}

function setInputValue(value) {
    let lastValue = input.value;
    input.value = value;
    // @see https://github.com/facebook/react/issues/11488
    let event = new Event('change', { bubbles: true });
    event.simulated = true;
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
    input.focus();
}