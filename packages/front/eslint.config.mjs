import monorepoConfig from "../eslint.config.mjs";

// Next lint no es compatible con ESLint 9 (mayo 2024)
const nextConfig = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
    },
    rules: {
    },
  },
];
const projectConfig = [
  {
    files: ["**/*.ts"],
    rules: {
      "import/no-internal-modules": "off",
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "react/prop-types": "off",
      "import/no-default-export": "off",
      "import/no-internal-modules": ["error", {
        allow: ["next/**"],
      }],
    },
  },
];
const ret = [
  ...monorepoConfig,
  ...nextConfig,
  ...projectConfig,
];

export default ret;
