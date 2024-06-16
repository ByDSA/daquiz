import path from "node:path";
import monorepoConfig from "../eslint.config.mjs";

// TODO: Next lint no es compatible con ESLint 9 (mayo 2024)
const nextConfig = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {},
    rules: {},
  },
  {
    files: ["next.config.mjs"],
    rules: {
      "import/no-default-export": "off",
    },
  },
];
const packageDir = path.join(import.meta.url, "..").slice("file:".length);
const projectConfig = [
  {
    files: ["**/*.ts{,x}"],
    rules: {
      ...nextConfig[0].rules,
      "react/prop-types": "off",
      "import/no-default-export": "off",
      "import/no-internal-modules": ["error", {
        allow: [
          "./**",
          "**/modules/**",
          "**/node_modules/**",
        ],
      },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["\\#modules/utils**", "*/modules/utils**"],
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
      "import/no-extraneous-dependencies": ["error", {
        packageDir,
      }],
    },
  },
  {
    files: ["**/modules/utils/**/*.ts{,x}", "**/*{model,dto}.ts{,x}"],
    rules: {
      "import/no-internal-modules": "off",
      "no-restricted-imports": "off",
    },
  },
];
const ret = [
  ...monorepoConfig,
  ...projectConfig,
  ...nextConfig,
];

export default ret;
