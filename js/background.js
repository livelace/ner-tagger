function send_data (message, sender, sendResponse) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        var page_url = tab.url;

        console.log(page_url);

        chrome.storage.sync.get(['nerURL', 'nerTimeout'], function (result) {
        var content = {content: message, url: encodeURIComponent(page_url)}

            $.ajax({
                url: result.nerURL,
                type: 'post',
                dataType: 'json',
                data: JSON.stringify(content),
                error: function (jqXHR, textStatus, errorThrown) {
                    sendResponse({status: 'error', code: jqXHR.status, text: errorThrown});
                },
                success: function (jqXHR, textStatus, errorThrown) {
                    sendResponse({status: 'success', code: jqXHR.status, text: errorThrown});
                },
                timeout: result.nerTimeout
            });
        });
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    send_data(message, sender, sendResponse);
    return true;
});