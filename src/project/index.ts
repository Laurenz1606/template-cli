import { ask } from "../inquirer";
import { EndCategory } from "../classes";
import { join } from "path";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import slugify from "slugify";
import { execSync } from "child_process";
import { copyAndReplaceFile } from "../utils";

export const Create = new EndCategory(
  "Create Project",
  "What type of project do you want to create?",
  [
    { msg: "Express (Backend)", handler: () => initExpress() },
    { msg: "Plain (Node)", handler: () => initPlain() },
    { msg: "React (Frontend)", handler: () => initReact() },
  ],
);

async function initExpress(noGit?: boolean) {}

async function initPlain(noGit?: boolean) {
  const name = await ask("What is the name of your Project?");

  const slug = slugify(name, { strict: true, lower: true });

  const projectFolder = join(process.cwd(), slug);

  mkdirSync(projectFolder, { recursive: true });

  let giturl = "";

  if (!noGit) giturl = await ask("What is the Github url your Project?");

  if (!noGit)
    execSync(
      `cd ${projectFolder} && git init && echo # ${slug} >> README.md && git add README.md && git commit -m "init README" && git branch -M main && git remote add origin ${giturl} && git push -u origin main`,
    );

  execSync(`cd ${projectFolder} && yarn init -y`);

  execSync(
    `cd ${projectFolder} && yarn add -D typescript ts-node ts-node-dev @types/node rimraf`,
  );

  execSync(`cd ${projectFolder} && yarn add dotenv @laurenz1606/logger`);

  const packageJSONPath = join(projectFolder, "package.json");

  let packageJSON = JSON.parse(readFileSync(packageJSONPath).toString());

  packageJSON.scripts = {
    build: "rimraf ./dist && tsc",
    "dev:start": "ts-node src/index.ts",
    "dev:watch": "ts-node-dev --respawn src/index.ts",
  };

  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

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
    join(__dirname, "env.plain.txt"),
    join(projectFolder, ".env"),
    {},
  );

  if (!noGit) execSync(`git add . && git commit -m "init project" && git push`);
}

async function initReact(noGit?: boolean) {}
