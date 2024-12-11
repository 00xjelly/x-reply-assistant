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

const emphasisFunctions = {
  uppercase: text => text.toUpperCase(),
  spaced: text => text.split('').join('.'),
  sparkles: text => `✨${text}✨`,
  crystal: text => `🔮${text}🔮`,
  exclaim: text => text.split('').map(char => `${char}!`).join('')
};

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
        'energy vampires', 'thought control', 'synthetic reality', 'matrix glitch',
        'psychic waves', 'astral projection', 'neural implants', 'forbidden knowledge'
      ],
      expressions: [
        '!!!', '!?!?!', '...', '👁️', '🔺', '⚠️', '🌌', '🧠', '🔮',
        '🛸', '🌀', '💫', '🌟', '⚡', '🔥', '💥', '🤯', '👽'
      ],
      emphasisTypes: ['uppercase', 'spaced', 'sparkles', 'crystal', 'exclaim']
    }
  ];

  chrome.storage.sync.set({ characters: defaultCharacters });
}

function handleReplyGeneration(request) {
  const { character, tweetContext } = request;
  // Ensure we have some text to work with
  const text = tweetContext?.text || 'this reality';
  return generateChaosReply(character, { text });
}

function generateChaosReply(character, tweetContext) {
  if (character.id !== 'chaotic') {
    return generateRegularReply(character, tweetContext);
  }

  const numSegments = 2 + Math.floor(Math.random() * 3); // 2-4 segments
  let reply = [];

  // Ensure at least one segment references the tweet content
  reply.push(generateChaosSegment(character, tweetContext, true));

  // Add additional random segments
  for (let i = 1; i < numSegments; i++) {
    reply.push(generateChaosSegment(character, tweetContext, false));
  }

  // Shuffle the segments
  reply.sort(() => Math.random() - 0.5);

  // Add random expressions
  const numExpressions = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numExpressions; i++) {
    const expression = character.expressions[Math.floor(Math.random() * character.expressions.length)];
    const insertPosition = Math.floor(Math.random() * (reply.length + 1));
    reply.splice(insertPosition, 0, expression);
  }

  // Randomly apply emphasis to some segments
  reply = reply.map(segment => {
    if (Math.random() > 0.7 && segment.length > 0) { // 30% chance of emphasis
      const emphasisType = character.emphasisTypes[Math.floor(Math.random() * character.emphasisTypes.length)];
      const emphasisFunction = emphasisFunctions[emphasisType];
      return emphasisFunction ? emphasisFunction(segment) : segment;
    }
    return segment;
  });

  return reply.join(' ');
}

function generateChaosSegment(character, tweetContext, mustReferenceTweet) {
  const segments = mustReferenceTweet ? [
    () => `The ${extractTopic(tweetContext.text)} is a clear sign of ${getRandomVocab(character)}`,
    () => `${extractTopic(tweetContext.text)} is exactly what THEY use to hide ${getRandomVocab(character)}`,
    () => `THEY don't want you to see the connection between ${getRandomVocab(character)} and ${extractTopic(tweetContext.text)}!`,
    () => `Your ${extractTopic(tweetContext.text)} energy aligns with the ${getRandomVocab(character)} frequency`
  ] : [
    () => `Did you know that ${getRandomVocab(character)} is connected to ${getRandomVocab(character)}?`,
    () => `I've been researching ${getRandomVocab(character)} for YEARS and finally someone gets it!`,
    () => `Wake up to the truth about ${getRandomVocab(character)}`,
    () => `This is EXACTLY what I saw in my ${getRandomVocab(character)} vision!`,
    () => `The ${getRandomVocab(character)} energy is strong with this one`,
    () => `I've been trying to warn everyone about ${getRandomVocab(character)}`,
    () => `They're using ${getRandomVocab(character)} to control the ${getRandomVocab(character)}!!!`
  ];

  return segments[Math.floor(Math.random() * segments.length)]();
}

function getRandomVocab(character) {
  return character.vocabulary[Math.floor(Math.random() * character.vocabulary.length)];
}

function extractTopic(text) {
  const words = text.split(' ')
    .filter(word => word.length > 3)
    .filter(word => !word.startsWith('@'))
    .filter(word => !word.startsWith('http'));
  
  return words[Math.floor(Math.random() * words.length)] || 'reality matrix';
}