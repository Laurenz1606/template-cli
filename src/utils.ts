import { execSync } from "child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import slugify from "slugify";
import { askC } from "./inquirer";

export async function copyAndReplaceFile(
  from: string,
  to: string,
  replace: { [key: string]: string },
) {
  let fileData = readFileSync(from, "utf-8");

  Object.keys(replace).forEach(
    (key) => (fileData = fileData.replace(new RegExp(key, "g"), replace[key])),
  );

  writeFileSync(to, fileData, "utf-8");
}

export function uppercaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowercaseFirstLetter(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function run(origin: string, commands: string) {
  execSync(`cd ${origin} && ${commands}`, { stdio: "ignore" });
}

export function slg(name: string) {
  return slugify(name, { strict: true, lower: true });
}

export async function notifyAndRMFolder(path: string, slug: string) {
  if (existsSync(path)) {
    const yn = await askC(
      `Folder ${slug} alredy exists, do you want to delete it?`,
    );
    if (!yn) process.exit(0);
    if (existsSync(path)) rmSync(path, { recursive: true });
  }
}