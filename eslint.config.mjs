export default [
  {
    files: ["chrome/lib/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        // Browser & WebExtensions
        window: "readonly",
        document: "readonly",
        location: "readonly",
        history: "readonly",
        alert: "readonly",
        chrome: "readonly",
        browser: "readonly",
        MutationObserver: "readonly",
        Event: "readonly",
        // jQuery
        $: "readonly",
        jQuery: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      "no-redeclare": "error",
    },
  },
  {
    ignores: ["**/jquery*.js"],
  },
];
