chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (!tab.url) return undefined;
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) return undefined;
    if (!tab.url.match(/https?:\/\/([a-zA-Z0-0]+\.)*(facebook|linkedin)\.com/)) {
        return undefined;
    }

    if (tab.active && changeInfo.status == 'complete') {
        chrome.scripting.executeScript(
            {
                target: {tabId: tabId, allFrames: true},
                files: ['lib/fontify.js'],
            }
        );
    }
});
