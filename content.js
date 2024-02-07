var extensionEnabled = false;
var intervalId;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "toggleExtensionCaptionDict") {
      extensionEnabled = request.isEnabledCaptionDict;
      // Call your function or perform actions based on extensionEnabled
      if(extensionEnabled){
        intervalId = setInterval(async function () {
          await foo();
        }, 500);
        console.log("Interval started");
      }else{
        clearInterval(intervalId);
        console.log("Interval stopped");
      }
      console.log("Extension " + (extensionEnabled ? "enabled" : "disabled"));
    }
  }
);

async function foo() {
  var videoPlayerElement = document.querySelector('.html5-video-player');
  if (videoPlayerElement && !videoPlayerElement.classList.contains('paused-mode')) {
    return;
  }

  var captionElements = document.querySelectorAll('.ytp-caption-segment');
  var captionLine = 0;

  captionElements.forEach(function (spanElement) {

    captionLine++;

    var textNodes = spanElement.innerHTML.split(' ');

    if (textNodes[0].includes("<span>") && captionLine != 2) {
      return;
    }

    spanElement.innerHTML = '';

    textNodes.forEach(function (textNode) {

      if(captionLine == 2){
        textNode = textNode.replace(/ /g, '');
        textNode = textNode.split('<span>').join('').split('</span>').join('');
      }

      if(textNode.trim() === '')  return;

      var text = textNode + " ";
      var span = document.createElement('span');
      span.textContent = text;
      span.onclick = async function () {
        var meaning = await getDefinition(text);
        alert(meaning);
      };
      spanElement.appendChild(span);
    });
  });

  await new Promise(resolve => setTimeout(resolve, 100));
}

async function getDefinition(word) {
  try {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const firstDefinition = data[0]?.meanings[0]?.definitions[0]?.definition;

    console.log('First definition:', firstDefinition);
    return firstDefinition;
  } catch (error) {
    console.error('Error during fetch:', error.message);
  }
}