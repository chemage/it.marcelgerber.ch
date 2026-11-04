// Site-wide settings (migrated from the Jekyll _config.yml).
export default {
  title: "Marcel's IT blog",
  tagline: "Streamline your IT",
  description: "Marcel's IT tips and tricks about things not quite straightforward.",
  url: "https://it.marcelgerber.ch", // no trailing slash
  lang: "en",
  timezone: "Europe/Zurich",
  themeMode: "dark", // "dark" | "light"; visitors can toggle and the choice is remembered
  avatar: "/assets/img/me.jpg",
  googleSiteVerification: "JLLSPl83ZG2DAwPxsd3is1ewcSU5AlkeNSO6_lh6nwU",
  author: { name: "Marcel Gerber", email: "me@marcelgerber.ch" },
  social: {
    github: "https://github.com/chemage",
    linkedin: "https://www.linkedin.com/in/marcelgerber/",
    facebook: "https://www.facebook.com/gerber.marcel",
  },
  comments: { provider: "disqus", disqusShortname: "marcels-it" }, // set provider to "" to disable
  nav: [
    { title: "Home", url: "/", icon: "house" },
    { title: "Categories", url: "/categories/", icon: "layers" },
    { title: "Tags", url: "/tags/", icon: "tags" },
    { title: "Archives", url: "/archives/", icon: "archive" },
    { title: "About", url: "/about/", icon: "info" },
  ],
};
