// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'checkLoginStatus':
      handleLoginStatusCheck(sendResponse);
      break;
    case 'getTweetContext':
      sendResponse(getCurrentTweetContext());
      break;
    case 'insertReply':
      insertReplyIntoTweet(request.reply);
      break;
  }
  return true;
});

let currentTweetContext = null;

function getCurrentTweetContext() {
  // Look for the reply box and the tweet text above it
  const replyBox = document.querySelector('[data-testid="tweetTextarea_0"]');
  if (!replyBox) return null;

  // Get the tweet we're replying to
  const tweetText = Array.from(document.querySelectorAll('[data-testid="tweetText"]'))
    .map(element => element.textContent)
    .filter(text => text.length > 0)[0];

  if (!tweetText) return null;

  return {
    text: tweetText,
    canReply: true
  };
}

function handleLoginStatusCheck(sendResponse) {
  const tweetContext = getCurrentTweetContext();
  sendResponse({
    loggedIn: true,
    tweetContext: tweetContext
  });
}

function insertReplyIntoTweet(reply) {
  const textarea = document.querySelector('[data-testid="tweetTextarea_0"]');
  if (textarea) {
    textarea.value = reply;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}