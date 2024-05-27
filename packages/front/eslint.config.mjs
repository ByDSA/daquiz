import path from "node:path";
import monorepoConfig from "../eslint.config.mjs";

// TODO: Next lint no es compatible con ESLint 9 (mayo 2024)
const nextConfig = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
    },
    rules: {
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
        allow: ["next/**", "*shared/**", "\\\#modules/*", "\\\#modules/utils/**"],
      }],
      "import/no-extraneous-dependencies": ["error", {
        packageDir,
      }],
    },
  },
];
const ret = [
  ...monorepoConfig,
  ...projectConfig,
];

export default ret;
