# ⚔️StudyQuest - Learn. Level Up. Conquer.
A gamified platform for studying via Quests (courses). You keep streaks, unlock achievements, and level up through xp on your journey to greatness. 

 📜 Upload PDFs
 > Upload any form of OCR PDFs, a Quest will automatically be generated for you.

  🏅 Experience Points
  > Earn XP as you solve nodes and level up and get Achievements upon reaching certan milestones

  🔥Streaks
  > Maintain a streak by doing quizes daily!

  ✉️Contact
  > Contact us at studyquest21@gmail.com
> or create an issue in this repository. The fastest way is to create a ticket in our Discord server

👾 For direct support, join our [Discord Server](https://discord.gg/Vhs8TPpDbK)

## Setup

StudyQuest is a static site with two serverless functions under `/api` (Vercel-style: `module.exports = async (req,res) => {}`) that proxy AI calls so the API key never reaches the browser.

**Important: this app cannot run on GitHub Pages.** GitHub Pages only serves static files — it has no Node.js runtime, so it cannot execute the `/api/*.js` functions, and it has no way to inject environment variables, so a `.env` file in the repo is never read by it. Both the AI quest generation and the chat assistant will fail on GitHub Pages with "Unexpected response from server."

Deploy instead to **Vercel** (zero config needed for this repo's function style):

1. Import the repo into Vercel (vercel.com → Add New Project → select this repo).
2. In the Vercel project's Settings → Environment Variables, add `ANTHROPIC_API_KEY` with your Anthropic key. Never commit it to the repo — a local `.env` file is only for `vercel dev` on your own machine and is never read by GitHub Pages or any static host.
3. Deploy. Vercel will serve the static files and run `/api/generate-quest.js` and `/api/chat.js` as serverless functions automatically.
4. Firebase Auth/Firestore config in `js/firebase-init.js` is a public client config (expected for Firebase) — but make sure Firestore Security Rules are configured in the Firebase console to restrict each user's `users/{uid}` and `quests/{uid}/items/*` documents to that user only.

## Subscription tiers

Everyone is currently on **Free** — `Vanguard` and `Ascendant` exist in the code (`js/tiers.js`, `api/_tiers.js`) and are visible on the Upgrade page, but there's no purchase flow yet, so they can't actually be selected.
