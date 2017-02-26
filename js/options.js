function save_options() {
    var nerURL = document.getElementById('nerURL').value;
    var nerTimeout = document.getElementById('nerTimeout').value;
    chrome.storage.sync.set({
        nerURL: nerURL,
        nerTimeout: nerTimeout
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        nerURL: 'https://example.com/api',
        nerTimeout: 3000
    }, function(items) {
        document.getElementById('nerURL').value = items.nerURL;
        document.getElementById('nerTimeout').value = items.nerTimeout;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
