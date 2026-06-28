// ══ SUBSCRIPTION TIERS ══
// Display + client-side gating only. Real AI-quality limits are enforced
// server-side in /api (the client cannot be trusted with that).
const TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: 'Begin your journey',
    badge: '🗡️',
    price: '$0',
    period: 'forever',
    purchasable: false,
    current: true,
    pdfPages: 15,
    dailyQuests: 3,
    features: [
      { icon: '📜', text: 'Up to 15 PDF pages per quest' },
      { icon: '⚔️', text: '5-6 nodes per quest' },
      { icon: '🤖', text: 'Efficient AI quest generation' },
      { icon: '🔁', text: '3 quest generations / day' },
    ],
  },
  vanguard: {
    id: 'vanguard',
    name: 'Vanguard',
    tagline: 'Act with greater power',
    badge: '⚡',
    price: '$6',
    period: '/month',
    purchasable: false,
    current: false,
    pdfPages: 40,
    dailyQuests: 20,
    features: [
      { icon: '📜', text: 'Up to 40 PDF pages per quest' },
      { icon: '⚔️', text: '7-9 nodes, deeper explanations' },
      { icon: '🧠', text: 'Sharper, more capable AI model' },
      { icon: '🔁', text: '20 quest generations / day' },
      { icon: '📊', text: 'Mastery Insights analytics', locked: true },
      { icon: '🚀', text: 'Priority generation queue', locked: true },
    ],
  },
  ascendant: {
    id: 'ascendant',
    name: 'Ascendant',
    tagline: 'Absolute quality, unleashed',
    badge: '👑',
    price: '$14',
    period: '/month',
    purchasable: false,
    current: false,
    pdfPages: 100,
    dailyQuests: 999,
    features: [
      { icon: '📜', text: 'Up to 100 PDF pages per quest' },
      { icon: '⚔️', text: '9-12 nodes, textbook-grade depth' },
      { icon: '🧠', text: 'Most capable AI model available' },
      { icon: '🔁', text: 'Unlimited quest generations' },
      { icon: '📊', text: 'Mastery Insights analytics', locked: true },
      { icon: '🚀', text: 'Priority generation queue', locked: true },
      { icon: '🖼️', text: 'Exclusive animated profile frames', locked: true },
      { icon: '🎯', text: 'Adaptive difficulty tuning', locked: true },
    ],
  },
};
const TIER_ORDER = ['free', 'vanguard', 'ascendant'];

function currentTier() {
  const t = UDATA?.tier;
  return TIERS[t] ? t : 'free';
}
function tierInfo(tierId) {
  return TIERS[tierId] || TIERS.free;
}
function hasFeatureAccess(featureName) {
  // No tier is purchasable yet, so every account is effectively on Free.
  // This helper exists so paywalled features have a single, ready-made gate
  // for when purchasing is wired up later.
  const t = currentTier();
  if (t === 'free') return false;
  const tier = TIERS[t];
  return tier.features.some((f) => f.text === featureName && !f.locked);
}
