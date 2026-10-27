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
        title: "The Lost Art of Having a Hobby",
        date: "2026-10-26",
        url: "https://substack.com/home/post/p-222253211",
        summary: "When was the last time you did something simply because you enjoyed it?...Read More"
      }
    ]
  },

  // ---- Editorial board ----
  // photo: put the image in the /images folder and write "images/filename.jpg"
  // Leave photo as "" to show the person's initials instead.
  board: [
    { name: "Emma Mulcahy", role: "Founder & CEO",   bio: "Emma Mulcahy is an undergraduate student at Cal Poly SLO. She is majoring in political science with a concentration in pre-law.", photo: "images/emma.jpeg" },
    { name: "Acacia Yoon", role: "Editor and Social Media Lead",   bio: "Acacia Yoon is an undergraduate student at Stanford University. She plans to study bio-medical computation and is on the pre-med track.", photo: "images/acacia.jpg" },
  ],

  // ---- Influencers & collaborators ----
  // platform: "tiktok", "instagram", "substack" or "youtube"
  collaborators: [
    { name: "Kelly Anderson", handle: "@thekellyanderson", platform: "tiktok",    url: "https://www.tiktok.com/@thekellyanderson",   photo: "" },
    { name: "Catherine Pinkos", handle: "@catherinepinknos", platform: "instagram", url: "https://www.instagram.com/catherinepinknos", photo: "" },
    { name: "Phoenix", handle: "@phoenix.star07", platform: "tiktok",    url: "https://www.tiktok.com/@phoenix.star07",   photo: "" },
    { name: "Serena Chappell", handle: "@serenachappell_", platform: "instagram", url: "https://www.instagram.com/serenachappell_", photo: "" }
  ]
};
