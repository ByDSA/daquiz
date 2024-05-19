import commonConfig from "./lib/eslint/eslint.config.mjs";

const projectConfigImportNoInternalModulesAllow = [
  "**/*modules/**/contexts/**/*",
];
const projectConfig = [
  {
    files: ["src/{modules,app}/**/!(*.spec).ts{,x}", "jest.config.ts"],
    rules: {
      "import/no-internal-modules": [
        "error",
        {
          allow: [
            ...projectConfigImportNoInternalModulesAllow,
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "import/no-internal-modules": "off",
    },
  },
];
const ret = [
  ...commonConfig,
  ...projectConfig,
];

export default ret;
