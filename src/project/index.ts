import { ask, askC } from "../inquirer";
import { EndCategory } from "../classes";
import { join } from "path";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import slugify from "slugify";
import { execSync } from "child_process";
import { copyAndReplaceFile } from "../utils";

export const Create = new EndCategory(
  "Create Project",
  "What type of project do you want to create?",
  [
    { msg: "Node (Backend)", handler: () => initPlain(true) },
    { msg: "React (Frontend)", handler: () => initReact() },
  ],
);

async function initPlain(noGit?: boolean, subfolder?: string) {
  const name = await ask("What is the name of your Project?");

  const slug = slugify(name, { strict: true, lower: true });

  const projectFolder = subfolder
    ? join(process.cwd(), slug, subfolder)
    : join(process.cwd(), slug);

  if (existsSync(projectFolder)) {
    const yn = await askC(
      `Folder ${slug} alredy exists, do you want to delete it?`,
    );
    if (!yn) process.exit(0);
    if (existsSync(projectFolder)) rmSync(projectFolder, { recursive: true });
  }

  mkdirSync(projectFolder, { recursive: true });

  let giturl = "";

  if (!noGit) giturl = await ask("What is the Github url your Project?");

  if (!noGit)
    execSync(
      `cd ${projectFolder} && git init && echo # ${slug} >> README.md && git add README.md && git commit -m "init README" && git branch -M main && git remote add origin ${giturl} && git push -u origin main`,
    );

  execSync(`cd ${projectFolder} && yarn init -y`);

  const packageJSONPath = join(projectFolder, "package.json");

  let packageJSON = JSON.parse(readFileSync(packageJSONPath).toString());

  packageJSON.scripts = {
    build: "rimraf ./dist && tsc",
    "dev:start": "ts-node src/index.ts",
    "dev:watch": "ts-node-dev --respawn src/index.ts",
  };

  packageJSON.main = "dist/index.js"

  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  execSync(
    `cd ${projectFolder} && yarn add -D typescript ts-node ts-node-dev @types/node rimraf`,
  );

  execSync(`cd ${projectFolder} && yarn add dotenv @laurenz1606/logger`);

  if (!noGit)
    copyAndReplaceFile(
      join(__dirname, "gitignore.txt"),
      join(projectFolder, ".gitignore"),
      {},
    );

  let srcFolder = join(projectFolder, "src");

  mkdirSync(join(projectFolder, "src"));

  copyAndReplaceFile(
    join(__dirname, "index.txt"),
    join(srcFolder, "index.ts"),
    {},
  );

  copyAndReplaceFile(
    join(__dirname, "logger.txt"),
    join(srcFolder, "logger.ts"),
    {},
  );

  copyAndReplaceFile(
    join(__dirname, "env.plain.txt"),
    join(projectFolder, ".env"),
    {},
  );

  copyAndReplaceFile(
    join(__dirname, "tsconfig.server.txt"),
    join(projectFolder, "tsconfig.json"),
    {},
  );

  const utilsFolder = join(srcFolder, "utils");

  mkdirSync(utilsFolder);

  writeFileSync(join(utilsFolder, ".gitkeep"), "");

  const mongoose = await askC("Do you want to add Mongoose to your Project?");

  if (mongoose) {
    execSync(
      `cd ${projectFolder} && yarn add mongoose uuid && yarn add -D @types/uuid`,
    );

    copyAndReplaceFile(
      join(__dirname, "mongoose.txt"),
      join(srcFolder, "mongoose.ts"),
      {},
    );

    appendFileSync(
      join(projectFolder, ".env"),
      readFileSync(join(__dirname, "env.mongoose.txt")),
    );

    appendFileSync(join(srcFolder, "index.ts"), `\nimport "./mongoose"`);

    const models = join(srcFolder, "Models");

    mkdirSync(models);

    writeFileSync(join(models, ".gitkeep"), "");
  }

  const redis = await askC("Do you want to add IOredis to your Project?");

  if (redis) {
    execSync(
      `cd ${projectFolder} && yarn add ioredis && yarn add -D @types/ioredis`,
    );

    copyAndReplaceFile(
      join(__dirname, "redisClient.txt"),
      join(srcFolder, "redisClient.ts"),
      {},
    );

    appendFileSync(
      join(projectFolder, ".env"),
      readFileSync(join(__dirname, "env.redis.txt")),
    );
  }

  const express = await askC(
    "Do you want to add express to your Project (incl. cors)?",
  );

  if (express) {
    execSync(
      `cd ${projectFolder} && yarn add express cors && yarn add -D @types/express @types/cors`,
    );

    copyAndReplaceFile(
      join(__dirname, "express.txt"),
      join(srcFolder, "express.ts"),
      {},
    );

    appendFileSync(
      join(projectFolder, ".env"),
      readFileSync(join(__dirname, "env.express.txt")),
    );

    appendFileSync(join(srcFolder, "index.ts"), `\nimport "./express"`);

    const middleWare = join(srcFolder, "MiddleWare");

    mkdirSync(middleWare);

    writeFileSync(join(middleWare, ".gitkeep"), "");

    const routers = join(srcFolder, "Routers");

    mkdirSync(routers);

    writeFileSync(join(routers, ".gitkeep"), "");

    const auth = await askC(
      "Do you want to add authfunctions to your Project?",
    );

    if (auth) {
      execSync(`cd ${projectFolder} && yarn add @authfunctions/express`);

      copyAndReplaceFile(
        join(__dirname, "auth.txt"),
        join(srcFolder, "auth.ts"),
        {},
      );

      appendFileSync(
        join(projectFolder, ".env"),
        readFileSync(join(__dirname, "env.auth.txt")),
      );
    }
  }

  appendFileSync(join(srcFolder, "index.ts"), `\n`);

  if (!noGit)
    execSync(
      `cd ${projectFolder} && git add . && git commit -m "init project" && git push`,
    );
}

async function initReact(noGit?: boolean) {}
