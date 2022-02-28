import { ask, askC } from "../inquirer";
import { EndCategory } from "../classes";
import { join } from "path";
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { notifyAndRMFolder, run, slg } from "../utils";

export const Projects = new EndCategory(
  "Create Project",
  "What type of project do you want to create?",
  [
    { msg: "Node (Backend)", handler: () => initPlain() },
    { msg: "React (Frontend)", handler: () => initReact() },
  ],
);

async function initPlain(noGit?: boolean, subfolder?: string) {
  const name = await ask("What is the name of your Project?");
  const slug = slg(name);

  const projectFolder = subfolder
    ? join(process.cwd(), slug, subfolder)
    : join(process.cwd(), slug);

  await notifyAndRMFolder(projectFolder, slug);

  mkdirSync(projectFolder, { recursive: true });

  let giturl = "";

  if (!noGit) giturl = await ask("What is the Github url your Project?");

  if (!noGit)
    run(
      projectFolder,
      `git init && echo # ${slug} >> README.md && git add README.md && git commit -m "init README" && git branch -M main && git remote add origin ${giturl} && git push -u origin main`,
    );

  run(projectFolder, "yarn init -y");

  const packageJSONPath = join(projectFolder, "package.json");

  let packageJSON = JSON.parse(readFileSync(packageJSONPath).toString());

  packageJSON.scripts = {
    build: "rimraf ./dist && tsc",
    "dev:start": "ts-node src/index.ts",
    "dev:watch": "ts-node-dev --respawn src/index.ts",
  };

  packageJSON.main = "dist/index.js";

  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  run(
    projectFolder,
    "yarn add -D typescript ts-node ts-node-dev @types/node rimraf",
  );

  run(projectFolder, "yarn add dotenv @laurenz1606/logger");

  if (!noGit)
    copyFileSync(
      join(__dirname, "gitignore.txt"),
      join(projectFolder, ".gitignore"),
    );

  let srcFolder = join(projectFolder, "src");

  mkdirSync(join(projectFolder, "src"));

  copyFileSync(join(__dirname, "index.txt"), join(srcFolder, "index.ts"));

  copyFileSync(join(__dirname, "logger.txt"), join(srcFolder, "logger.ts"));

  copyFileSync(join(__dirname, "env.plain.txt"), join(projectFolder, ".env"));

  copyFileSync(
    join(__dirname, "tsconfig.server.txt"),
    join(projectFolder, "tsconfig.json"),
  );

  const utilsFolder = join(srcFolder, "utils");

  mkdirSync(utilsFolder);

  writeFileSync(join(utilsFolder, ".gitkeep"), "");

  const mongoose = await askC("Do you want to add Mongoose to your Project?");

  if (mongoose) {
    run(projectFolder, "yarn add mongoose uuid && yarn add -D @types/uuid");

    copyFileSync(
      join(__dirname, "mongoose.txt"),
      join(srcFolder, "mongoose.ts"),
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
    run(projectFolder, "yarn add ioredis && yarn add -D @types/ioredis");

    copyFileSync(
      join(__dirname, "redisClient.txt"),
      join(srcFolder, "redisClient.ts"),
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
    run(
      projectFolder,
      "yarn add express cors && yarn add -D @types/express @types/cors",
    );

    copyFileSync(join(__dirname, "express.txt"), join(srcFolder, "express.ts"));

    appendFileSync(
      join(projectFolder, ".env"),
      readFileSync(join(__dirname, "env.express.txt")),
    );

    appendFileSync(join(srcFolder, "index.ts"), `\nimport "./express"`);

    const middleWare = join(srcFolder, "MiddleWares");

    mkdirSync(middleWare);

    writeFileSync(join(middleWare, ".gitkeep"), "");

    const routers = join(srcFolder, "Routers");

    mkdirSync(routers);

    writeFileSync(join(routers, ".gitkeep"), "");

    const auth = await askC(
      "Do you want to add authfunctions to your Project?",
    );

    if (auth) {
      run(projectFolder, "yarn add @authfunctions/express");

      copyFileSync(join(__dirname, "auth.txt"), join(srcFolder, "auth.ts"));

      appendFileSync(
        join(projectFolder, ".env"),
        readFileSync(join(__dirname, "env.auth.txt")),
      );
    }
  }

  appendFileSync(join(srcFolder, "index.ts"), `\n`);

  if (!noGit)
    run(projectFolder, `git add . && git commit -m "init project" && git push`);
}

async function initReact(noGit?: boolean, subfolder?: string) {
  // const name = await ask("What is the name of your Project?");
  // const slug = slg(name);

  // const projectFolder = subfolder
  //   ? join(process.cwd(), slug, subfolder)
  //   : join(process.cwd(), slug);

  // await notifyAndRMFolder(projectFolder, slug);
}
