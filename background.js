// Function to get the extension state from storage
function getExtensionState(callback) {
    chrome.storage.local.get('isEnabledCaptionDict', function (result) {
        var isEnabled = result.isEnabledCaptionDict !== undefined ? result.isEnabledCaptionDict : true;
        callback(isEnabled);
    });
}

// Function to set the extension state in storage
function setExtensionState(isEnabled) {
    chrome.storage.local.set({ 'isEnabledCaptionDict': isEnabled });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "toggleExtensionCaptionDict") {
            getExtensionState(function (isEnabled) {
                isEnabled = !isEnabled;
                sendResponse(isEnabled);
                setExtensionState(isEnabled);
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    var activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, { message: "toggleExtensionCaptionDict", isEnabledCaptionDict: isEnabled });
                });
            });
            return true;
        }else if(request.message === "getExtensionState"){
            getExtensionState(function(isEnabled) {
                sendResponse(isEnabled);
            });
            return true; 
        }
    }
);