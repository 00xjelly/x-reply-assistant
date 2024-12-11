// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'checkLoginStatus':
      handleLoginStatusCheck(sendResponse);
      break;
    case 'getTweetContext':
      sendResponse(currentTweetContext);
      break;
    case 'insertReply':
      insertReplyIntoTweet(request.reply);
      break;
  }
  return true;
});

let currentTweetContext = null;

function checkLoginStatus() {
  const userNav = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
  return !!userNav;
}

function getTweetContext() {
  if (!window.location.pathname.includes('/status/')) {
    return null;
  }

  const tweetText = document.querySelector('[data-testid="tweetText"]');
  const authorElement = document.querySelector('[data-testid="User-Name"]');
  
  if (!tweetText || !authorElement) return null;

  return {
    text: tweetText.textContent,
    author: authorElement.textContent,
    url: window.location.href
  };
}

function handleLoginStatusCheck(sendResponse) {
  const loggedIn = checkLoginStatus();
  currentTweetContext = loggedIn ? getTweetContext() : null;
  sendResponse({ loggedIn, tweetContext: currentTweetContext });
}

function insertReplyIntoTweet(reply) {
  const replyButton = document.querySelector('[data-testid="reply"]');
  if (replyButton) {
    replyButton.click();
    setTimeout(() => {
      const textarea = document.querySelector('[data-testid="tweetTextarea_0"]');
      if (textarea) {
        textarea.value = reply;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 500);
  }
}