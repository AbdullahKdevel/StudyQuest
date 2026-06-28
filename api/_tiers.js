// Shared tier -> AI quality configuration for serverless endpoints.
// Mirrors js/tiers.js on the client (display copy only lives client-side;
// these limits are the ones actually enforced, since the client cannot be trusted).
const TIER_AI_CONFIG = {
  free: {
    model: 'claude-haiku-4-5-20251001',
    maxTokens: 4800,
    temperature: 0.65,
    maxChars: 8000,
    nodeRange: '6-7',
    questionDepth: '4-5 questions per node',
    qualityNote: 'Explanations must be a full, clear 1-2 sentences that actually teach the concept — never a one-word or lazy answer.',
  },
  vanguard: {
    model: 'claude-sonnet-4-6',
    maxTokens: 8000,
    temperature: 0.7,
    maxChars: 18000,
    nodeRange: '8-10',
    questionDepth: '5-6 questions per node',
    qualityNote: 'Write rich, well-reasoned explanations (2-3 sentences) that connect the answer back to the underlying concept, vary question difficulty within each node, and give nodes a cohesive narrative thread.',
  },
  ascendant: {
    model: 'claude-opus-4-8',
    maxTokens: 14000,
    temperature: 0.75,
    maxChars: 30000,
    nodeRange: '10-13',
    questionDepth: '6-7 questions per node, mixing recall, application, and analysis',
    qualityNote: 'Produce exceptional, textbook-quality explanations (3-4 sentences) that teach the underlying concept in depth, not just the answer. Craft genuinely plausible distractors, weave a cohesive narrative across node names, and surface one "deep insight" callout per node that connects the concept to a real-world application.',
  },
};

function resolveTier(tier) {
  return Object.prototype.hasOwnProperty.call(TIER_AI_CONFIG, tier) ? tier : 'free';
}

module.exports = { TIER_AI_CONFIG, resolveTier };
