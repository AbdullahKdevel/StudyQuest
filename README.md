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

1. Deploy the repo to a host that runs the `/api/*.js` files as serverless functions (e.g. Vercel — zero config needed).
2. Set the environment variable `ANTHROPIC_API_KEY` in your hosting provider's project settings. Never commit it to the repo.
3. Firebase Auth/Firestore config in `js/firebase-init.js` is a public client config (expected for Firebase) — but make sure Firestore Security Rules are configured in the Firebase console to restrict each user's `users/{uid}` and `quests/{uid}/items/*` documents to that user only.

## Subscription tiers

Everyone is currently on **Free** — `Vanguard` and `Ascendant` exist in the code (`js/tiers.js`, `api/_tiers.js`) and are visible on the Upgrade page, but there's no purchase flow yet, so they can't actually be selected.
