import commonConfig from "./lib/eslint/eslint.config.mjs";

const projectConfig = [
  {
    files: ["**/*.ts{,x}"],
    rules: {
      "import/no-internal-modules": ["error", {
        allow: [
          "**/modules/**",
          "**/utils/**",
        ],
      },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["\\#modules/utils**", "*/modules/utils**", "\\#/utils/**"],
              message: "Use #utils instead of another access",
            },
            {
              group: ["\\#/modules/**"],
              message: "Use \"#modules\" instead of \"#/modules\"",
            },
            {
              group: ["\\#shared/models/**"],
              message: "Cannot import from \"#shared\"",
            },
          ],
        },
      ],
    },
  },
];
const ret = [
  ...commonConfig,
  ...projectConfig,
];

export default ret;
