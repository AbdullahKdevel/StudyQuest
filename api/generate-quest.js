const { TIER_AI_CONFIG, resolveTier } = require('./_tiers');

function buildPrompt(pdfText, cfg) {
  return `You are the master quest designer for StudyQuest, a gamified learning app. Analyse the study material below and design an outstanding, pedagogically sound learning quest in strict JSON.

Required JSON shape (no extra fields, no comments):
{
  "title": "Epic, dramatic quest title",
  "subtitle": "Subject · concise topic description",
  "emoji": "single relevant emoji",
  "tags": ["Subject", "Level"],
  "nodes": [
    {
      "id": "n_1",
      "type": "lesson",
      "name": "Dramatic, thematic node name",
      "desc": "One-sentence description of what this node covers",
      "xp": 40,
      "quizType": "mcq",
      "difficulty": "easy",
      "questions": [
        {"type":"mcq","q":"Question?","options":["A","B","C","D"],"answer":0,"exp":"Explanation"}
      ]
    }
  ]
}

Question type schemas:
- mcq: "options" array of exactly 4 plausible items, "answer" is the correct index (0-3), include "exp"
- truefalse: "answer" is boolean, include "exp"
- fill: "answer" is the exact word/phrase, optional "hint"
- match: "pairs" is an array of exactly 4 [term, definition] tuples

Design rules:
- Create ${cfg.nodeRange} nodes total. The LAST node MUST be {"type":"boss","quizType":"mixed","difficulty":"hard"} and synthesize the whole quest.
- Each non-boss node: ${cfg.questionDepth}. Boss node: 5-6 questions mixing every question type used earlier.
- XP guide: easy 35-40, medium 50-60, hard 70-80, boss 120-150.
- Every question MUST be derived directly from the study material — never invent facts not present or implied by it.
- Distractors (wrong MCQ options) must be plausible and topically related, never silly or obviously wrong.
- Order nodes so difficulty escalates logically, building on earlier concepts.
- Node names should be dramatic and thematic but the "desc" and "exp" fields must be clear, accurate, and educational.
- ${cfg.qualityNote}
- IDs must be unique strings "n_1", "n_2", etc.

Return ONLY the raw JSON object. No markdown fences, no preamble, no trailing commentary.

STUDY MATERIAL:
${pdfText}`;
}

function parseQuestJSON(raw) {
  let jsonStr = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  if (!jsonStr.startsWith('{')) {
    const m = jsonStr.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Could not find JSON in the AI response.');
    jsonStr = m[0];
  }
  let quest;
  try {
    quest = JSON.parse(jsonStr);
  } catch (_) {
    throw new Error('Could not parse the AI response. Please try again.');
  }
  if (!quest || !Array.isArray(quest.nodes) || !quest.nodes.length) {
    throw new Error('The AI returned no quest nodes. Try a more text-rich PDF.');
  }
  return quest;
}

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
  const text = typeof body.text === 'string' ? body.text : '';
  if (text.trim().length < 200) {
    res.status(400).json({ error: 'Study material is too short to build a quest from.' });
    return;
  }
  const tier = resolveTier(body.tier);
  const cfg = TIER_AI_CONFIG[tier];
  const prompt = buildPrompt(text.slice(0, cfg.maxChars), cfg);

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: cfg.maxTokens,
        temperature: cfg.temperature,
        messages: [{ role: 'user', content: prompt }],
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
    const rawText = (data.content || []).map((c) => c.text || '').join('');
    if (!rawText) {
      res.status(502).json({ error: 'No response from AI. Please try again.' });
      return;
    }
    const quest = parseQuestJSON(rawText);
    quest.id = 'q_' + Date.now();
    quest.tier = tier;
    quest.xpTotal = quest.nodes.reduce((s, n) => s + (n.xp || 0), 0);
    res.status(200).json({ quest });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error generating quest.' });
  }
};
