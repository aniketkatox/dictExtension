document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('toggleButton');

    // Function to update the button state based on isEnabled
    function updateButtonState(isEnabled) {
        console.log("Updating state");
        if (isEnabled) {
            toggleButton.textContent = 'Disable';
            toggleButton.classList.remove('disabled');
        } else {
            toggleButton.textContent = 'Enable';
            toggleButton.classList.add('disabled');
        }
    }

    toggleButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ message: "toggleExtensionCaptionDict" }, function (isEnabled) {
            updateButtonState(isEnabled);
        });
    });

    // Get the initial extension state and update the button
    chrome.runtime.sendMessage({ message: "getExtensionState" }, function (isEnabled) {
        updateButtonState(isEnabled);
    });
});