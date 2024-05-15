import "reflect-metadata";

import { existsSync } from "node:fs";
import * as dotenv from "dotenv";

function isDebugging(): boolean {
  return process.env.DEBUG === "true";
}

function loadEnvsFile(p: string): void {
  if (!existsSync(p))
    console.warn(`File ${p} does not exist`);

  dotenv.config( {
    path: p,
    override: true,
  } );
}

loadEnvsFile(".env.dev");
loadEnvsFile("test/.env");

if (!isDebugging()) {
  globalThis.console.log = jest.fn(); // Mockear console.log
  globalThis.console.error = jest.fn(); // Mockear console.error
  globalThis.console.warn = jest.fn(); // Mockear console.warn
}
