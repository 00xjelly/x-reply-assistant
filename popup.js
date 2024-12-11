// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  checkLoginAndTweetStatus();
  loadCharacters();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  document.getElementById('characters').addEventListener('change', handleCharacterChange);
  document.getElementById('copyReply').addEventListener('click', copyReplyToClipboard);
  document.getElementById('insertReply').addEventListener('click', insertReply);
  document.getElementById('manageCharacters').addEventListener('click', openCharacterManager);
}

// Check if user is logged in and on a tweet
function checkLoginAndTweetStatus() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'checkLoginStatus'}, function(response) {
      if (response && response.loggedIn) {
        showMainContent();
        if (response.tweetContext) {
          handleTweetContext(response.tweetContext);
        }
      } else {
        showLoginPrompt();
      }
    });
  });
}

// Show/hide main content
function showMainContent() {
  document.getElementById('loginStatus').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
}

function showLoginPrompt() {
  document.getElementById('loginStatus').classList.remove('hidden');
  document.getElementById('mainContent').classList.add('hidden');
}

// Load characters from storage
function loadCharacters() {
  chrome.storage.sync.get('characters', function(data) {
    const characters = data.characters || [];
    populateCharacterSelect(characters);
  });
}

// Populate character dropdown
function populateCharacterSelect(characters) {
  const select = document.getElementById('characters');
  select.innerHTML = '<option value="default">Select a character...</option>';
  
  characters.forEach(char => {
    const option = document.createElement('option');
    option.value = char.id;
    option.textContent = char.name;
    select.appendChild(option);
  });
}

// Handle character selection change
function handleCharacterChange() {
  const characterId = document.getElementById('characters').value;
  if (characterId === 'default') {
    clearReply();
    return;
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getTweetContext'}, function(tweetContext) {
      if (tweetContext) {
        generateReply(characterId, tweetContext);
      }
    });
  });
}

// Clear reply area
function clearReply() {
  document.getElementById('suggestedReply').textContent = '';
}

// Generate reply using background script
function generateReply(characterId, tweetContext) {
  chrome.storage.sync.get('characters', function(data) {
    const character = data.characters.find(c => c.id === characterId);
    if (!character) return;

    chrome.runtime.sendMessage({
      action: 'generateReply',
      character: character,
      tweetContext: tweetContext
    }, function(response) {
      if (response && response.reply) {
        document.getElementById('suggestedReply').textContent = response.reply;
      }
    });
  });
}

// Copy reply to clipboard
function copyReplyToClipboard() {
  const replyText = document.getElementById('suggestedReply').textContent;
  if (!replyText) return;

  navigator.clipboard.writeText(replyText).then(() => {
    const button = document.getElementById('copyReply');
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = 'Copy to Clipboard';
    }, 2000);
  });
}

// Insert reply into tweet box
function insertReply() {
  const reply = document.getElementById('suggestedReply').textContent;
  if (!reply) return;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'insertReply',
      reply: reply
    });
  });
}

// Open character manager
function openCharacterManager() {
  chrome.runtime.openOptionsPage();
}

// Handle tweet context updates
function handleTweetContext(context) {
  const characterId = document.getElementById('characters').value;
  if (characterId !== 'default') {
    generateReply(characterId, context);
  }
}