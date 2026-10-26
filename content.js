/*
 * ============================================================
 *  ANGELS FOR AID: SITE CONTENT ♡
 *  This is the only file you need to edit to update the site.
 *  Replace anything marked TODO. Keep the quotes and commas!
 * ============================================================
 */
window.SITE = {
  name: "Angels for Aid",
  tagline: "combining beauty with social awareness",
  mission:
    "A digital humanitarian fashion magazine that drives to connect young women with humanitarianism! A4A is a collection of blogs connecting beauty, fashion, and lifestyle with advocacy,  relief work, and civic engagement, written by ordinary users, microinfluencers, and influencers. " +
    "This appears in the \"about us\" section near the top of the page.",
  email: "angelsforaid@gmail.com",

  // Words that scroll across the pink bar at the very top of the page
  ticker: [
    "fashion is political!",
    "dress loud, speak louder",
    "angels for aid",
    "read our weekly newsletter!",
    "subscribe to our substack",
    "style with substance"
  ],

  // The three tags in the "about us" section
  pillars: [
    { title: "style",     text: "Fashion is how we show up. We use it to start conversations." },
    { title: "substance", text: "Clear, honest coverage of the issues that matter, every week." },
    { title: "aid",       text: "Turning attention into action for the causes we care about." }
  ],

  // ---- Social links ----
  socials: {
    tiktok:    { url: "https://www.tiktok.com/@angels4aid",     handle: "@angels4aid" },
    instagram: { url: "https://www.instagram.com/angelsforaid", handle: "@angelsforaid" },
    substack:  { url: "https://angelsforaid.substack.com",      handle: "angelsforaid.substack.com" }
  },

  // ---- Newsletter ----
  newsletter: {
    showSignup: true, // shows Substack's own email sign-up box
    blurb: "Our weekly newsletter, with stories, style and ways to help, delivered to your inbox.",
    // Add each new issue at the TOP of this list. Leave it empty [] to hide this part.
    issues: [
      {
        title: "I Attended a (Free) Turning Point USA Event.. Here are my Thoughts.",
        date: "2026-10-22",
        url: "https://angelsforaid.substack.com/p/i-attended-a-free-turning-point-usa",
        summary: "A few nights ago, my university held an event with Turning Point USA (TPUSA)..."
      }
    ]
  },

  // ---- Editorial board ----
  // photo: put the image in the /images folder and write "images/filename.jpg"
  // Leave photo as "" to show the person's initials instead.
  board: [
    { name: "TODO Full Name", role: "Editor-in-Chief",   bio: "TODO: A short bio, 2–3 sentences.", photo: "" },
    { name: "TODO Full Name", role: "Managing Editor",   bio: "TODO: A short bio, 2–3 sentences.", photo: "" },
    { name: "TODO Full Name", role: "Social Media Lead", bio: "TODO: A short bio, 2–3 sentences.", photo: "" }
  ],

  // ---- Influencers & collaborators ----
  // platform: "tiktok", "instagram", "substack" or "youtube"
  collaborators: [
    { name: "TODO Creator", handle: "@handle", platform: "tiktok",    url: "https://www.tiktok.com/@handle",   photo: "" },
    { name: "TODO Creator", handle: "@handle", platform: "instagram", url: "https://www.instagram.com/handle", photo: "" },
    { name: "TODO Creator", handle: "@handle", platform: "tiktok",    url: "https://www.tiktok.com/@handle",   photo: "" },
    { name: "TODO Creator", handle: "@handle", platform: "instagram", url: "https://www.instagram.com/handle", photo: "" }
  ]
};
