// Shared tier -> AI quality configuration for serverless endpoints.
// Mirrors js/tiers.js on the client (display copy only lives client-side;
// these limits are the ones actually enforced, since the client cannot be trusted).
const TIER_AI_CONFIG = {
  free: {
    model: 'claude-haiku-4-5-20251001',
    maxTokens: 3200,
    temperature: 0.6,
    maxChars: 6000,
    nodeRange: '5-6',
    questionDepth: 'concise, 3-4 questions per node',
    qualityNote: 'Keep explanations short (1 sentence) to conserve tokens.',
  },
  vanguard: {
    model: 'claude-sonnet-4-6',
    maxTokens: 6500,
    temperature: 0.7,
    maxChars: 16000,
    nodeRange: '7-9',
    questionDepth: '4-5 questions per node',
    qualityNote: 'Write clear, well-reasoned explanations (1-2 sentences) and vary question difficulty within each node.',
  },
  ascendant: {
    model: 'claude-opus-4-8',
    maxTokens: 11000,
    temperature: 0.75,
    maxChars: 28000,
    nodeRange: '9-12',
    questionDepth: '5-6 questions per node, mixing recall, application, and analysis',
    qualityNote: 'Produce exceptional, textbook-quality explanations (2-3 sentences) that teach the underlying concept, not just the answer. Craft genuinely plausible distractors and weave a cohesive narrative across node names.',
  },
};

function resolveTier(tier) {
  return Object.prototype.hasOwnProperty.call(TIER_AI_CONFIG, tier) ? tier : 'free';
}

module.exports = { TIER_AI_CONFIG, resolveTier };
