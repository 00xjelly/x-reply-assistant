// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    initializeDefaultCharacters();
  }
});

// Listen for messages
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
      id: 'professional',
      name: 'Professional',
      tone: 'formal',
      traits: ['articulate', 'respectful', 'insightful'],
      responsePatterns: [
        'Thank you for sharing your perspective on {topic}. {constructivePoint}',
        'Interesting analysis. From my professional experience, {insight}',
        'This raises some important points about {topic}. Consider also {addition}'
      ]
    },
    {
      id: 'cheerful',
      name: 'Cheerful Supporter',
      tone: 'positive',
      traits: ['enthusiastic', 'encouraging', 'optimistic'],
      responsePatterns: [
        'Love this take on {topic}! ⭐ {positiveReinforcement}',
        'This is amazing! 🎉 {enthusiasticResponse}',
        'You are absolutely crushing it! 💪 {supportiveComment}'
      ]
    }
  ];

  chrome.storage.sync.set({ characters: defaultCharacters });
}

function handleReplyGeneration(request) {
  const { character, tweetContext } = request;
  return generateReply(character, tweetContext);
}

function generateReply(character, tweetContext) {
  const pattern = character.responsePatterns[Math.floor(Math.random() * character.responsePatterns.length)];
  const topic = extractTopic(tweetContext.text);
  
  return pattern
    .replace('{topic}', topic)
    .replace('{constructivePoint}', generateConstructivePoint())
    .replace('{insight}', generateInsight())
    .replace('{addition}', generateAddition())
    .replace('{positiveReinforcement}', generatePositiveReinforcement())
    .replace('{enthusiasticResponse}', generateEnthusiasticResponse())
    .replace('{supportiveComment}', generateSupportiveComment());
}

function extractTopic(text) {
  const words = text.split(' ').filter(word => word.length > 4);
  return words[Math.floor(Math.random() * words.length)] || 'this';
}

function generateConstructivePoint() {
  const points = [
    'This could have significant implications for the industry.',
    'Your approach offers a fresh perspective on the matter.',
    'The data seems to support your conclusion.'
  ];
  return points[Math.floor(Math.random() * points.length)];
}

function generateInsight() {
  const insights = [
    'similar approaches have shown promising results',
    'this aligns with current industry trends',
    'the market seems ready for such innovations'
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

function generateAddition() {
  const additions = [
    'the long-term implications',
    'potential scalability aspects',
    'market readiness factors'
  ];
  return additions[Math.floor(Math.random() * additions.length)];
}

function generatePositiveReinforcement() {
  const reinforcements = [
    'Your insights are so valuable! ⭐',
    'This is exactly what we needed to hear! ✨',
    'You always bring such great energy! 🎯'
  ];
  return reinforcements[Math.floor(Math.random() * reinforcements.length)];
}

function generateEnthusiasticResponse() {
  const responses = [
    'Keep sharing these amazing ideas! 🚀',
    'You are really onto something here! ⭐',
    'This is pure genius! 💫'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateSupportiveComment() {
  const comments = [
    'Your dedication to this is inspiring! ⭐',
    'You are making such a positive impact! ✨',
    'Keep leading the way! 🎯'
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}