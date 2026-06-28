const SYSTEM_PROMPT = `You are the StudyQuest Assistant, a friendly in-app helper for the StudyQuest web app. Answer questions ONLY about StudyQuest using the knowledge below. Be concise (2-4 sentences unless asked for detail), warm, and encouraging, matching StudyQuest's adventurous "quest" tone without being overly theatrical.

ABOUT STUDYQUEST:
- StudyQuest turns any PDF study material into a gamified learning "Quest" made of a path of "nodes" (lessons), ending in a "Boss" node.
- Users upload a PDF on the "New" tab; AI reads it and generates a structured quest with multiple-choice, true/false, fill-in-the-blank, and matching questions.
- Completing a node's quiz with at least 60% correct earns XP and marks it conquered; scoring 100% with no hearts lost counts as a "Perfect" run for bonus XP and the Flawless achievement line.
- Each quiz attempt gives 3 hearts; a wrong answer costs a heart, but you can still finish the quiz with 0 hearts.
- XP increases your Level (see the Level Tree page) and unlocks Achievements (see the Awards tab).
- Daily Streaks increase by completing at least one node each day; missing a full day resets the streak.
- The Leaderboard (Ranks tab) ranks all scholars by total XP.
- Users can edit their display name and avatar from the profile menu (avatar icon, top right).
- StudyQuest has three subscription tiers: Free (default for everyone today), Vanguard, and Ascendant. Higher tiers generate noticeably higher-quality quests (longer PDFs, more nodes, deeper AI-written explanations) and unlock extra features. Paid tiers are visible on the Upgrade page but are not yet purchasable — every account is currently on Free.
- Quests can be deleted from the quest path page ("Delete Quest") which requires typing the quest's exact name to confirm; XP already earned is kept.
- If a user asks how to do something not covered here, tell them honestly that you don't have that information rather than guessing.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY configuration.' });
    return;
  }
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) {
    res.status(400).json({ error: 'No messages provided.' });
    return;
  }
  const trimmed = messages.slice(-12).map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: String(m.content || '').slice(0, 2000),
  }));

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        temperature: 0.4,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });
    if (!resp.ok) {
      let msg = `AI service error (${resp.status})`;
      try {
        const e = await resp.json();
        if (e?.error?.message) msg += ': ' + e.error.message;
      } catch (_) {}
      res.status(502).json({ error: msg });
      return;
    }
    const data = await resp.json();
    const reply = (data.content || []).map((c) => c.text || '').join('').trim();
    res.status(200).json({ reply: reply || "I couldn't come up with a reply — try asking again." });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error.' });
  }
};
