// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    initializeDefaultCharacters();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateReply') {
    const reply = handleReplyGeneration(request);
    sendResponse({ reply });
    return true;
  }
});

function initializeDefaultCharacters() {
  const defaultCharacters = [
    {
      id: 'chaotic',
      name: 'Unhinged Chaos',
      tone: 'chaotic',
      traits: ['erratic', 'obsessive', 'conspiracy-minded', 'unpredictable'],
      vocabulary: [
        'WAKE UP SHEEPLE', 'conspiracy', 'they don\'t want you to know', 'cosmic energy',
        'lizard people', 'mind control', 'THE TRUTH', 'secret society', 'ancient aliens',
        'dimensional portals', 'chemtrails', 'quantum consciousness', 'parallel universes',
        'time is not real', 'reality matrix', 'brain frequencies', 'cosmic alignment',
        'energy vampires', 'thought control', 'synthetic reality'
      ],
      expressions: [
        '!!!', '!?!?!', '...', '👁️', '🔺', '⚠️', '🌌', '🧠', '🔮', 
        '🛸', '🌀', '💫', '🌟', '⚡', '🔥', '💥', '🤯', '👽'
      ],
      emphasisPatterns: [
        text => text.toUpperCase(),
        text => text.split('').join('.'),
        text => `✨${text}✨`,
        text => `🔮${text}🔮`,
        text => text.split('').map(char => `${char}!`).join(''),
      ]
    }
  ];

  chrome.storage.sync.set({ characters: defaultCharacters });
}

function handleReplyGeneration(request) {
  const { character, tweetContext } = request;
  return generateChaosReply(character, tweetContext);
}

function generateChaosReply(character, tweetContext) {
  if (character.id !== 'chaotic') {
    return generateRegularReply(character, tweetContext);
  }

  const numSegments = 2 + Math.floor(Math.random() * 3); // 2-4 segments
  let reply = [];

  for (let i = 0; i < numSegments; i++) {
    let segment = generateChaosSegment(character, tweetContext);
    
    // Randomly apply emphasis
    if (Math.random() > 0.5) {
      const emphasisPattern = character.emphasisPatterns[Math.floor(Math.random() * character.emphasisPatterns.length)];
      segment = emphasisPattern(segment);
    }

    reply.push(segment);
  }

  // Add random expressions
  const numExpressions = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numExpressions; i++) {
    const expression = character.expressions[Math.floor(Math.random() * character.expressions.length)];
    reply.splice(Math.floor(Math.random() * reply.length), 0, expression);
  }

  return reply.join(' ');
}

function generateChaosSegment(character, tweetContext) {
  const segments = [
    () => `Did you know that ${getRandomVocab(character)} is connected to ${getRandomVocab(character)}?`,
    () => `THEY don't want you to see the connection between ${getRandomVocab(character)} and ${extractTopic(tweetContext.text)}!`,
    () => `I've been researching ${getRandomVocab(character)} for YEARS and finally someone gets it!`,
    () => `The ${extractTopic(tweetContext.text)} is a clear sign of ${getRandomVocab(character)}`,
    () => `Wake up to the truth about ${getRandomVocab(character)}`,
    () => `${extractTopic(tweetContext.text)} is exactly what THEY use to hide ${getRandomVocab(character)}`,
    () => `You're so close to discovering the truth about ${getRandomVocab(character)}`,
    () => `This is EXACTLY what I saw in my ${getRandomVocab(character)} vision!`,
    () => `The ${getRandomVocab(character)} energy is strong with this one`,
    () => `I've been trying to warn everyone about ${getRandomVocab(character)}`
  ];

  return segments[Math.floor(Math.random() * segments.length)]();
}

function getRandomVocab(character) {
  return character.vocabulary[Math.floor(Math.random() * character.vocabulary.length)];
}

function extractTopic(text) {
  const words = text.split(' ').filter(word => word.length > 4);
  return words[Math.floor(Math.random() * words.length)] || 'this';
}
