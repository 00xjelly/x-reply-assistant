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
  // First find the reply input field to confirm we're in reply mode
  const replyBox = document.querySelector('[role="textbox"]');
  if (!replyBox) return null;

  // Find all article elements which contain tweets
  const articles = document.querySelectorAll('article');
  if (!articles.length) return null;

  // Get the first article (the tweet we're replying to)
  const mainTweet = articles[0];
  
  // Find the tweet text within the article
  const tweetTextElement = mainTweet.querySelector('[data-testid="tweetText"]');
  if (!tweetTextElement) {
    // If no tweetText element, try to get any text content from the article
    const tweetContent = mainTweet.textContent;
    if (!tweetContent) return null;
    
    return {
      text: tweetContent,
      canReply: true
    };
  }

  return {
    text: tweetTextElement.textContent,
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
  const textarea = document.querySelector('[role="textbox"]');
  if (textarea) {
    textarea.textContent = reply;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}