import { readFileSync, writeFileSync } from "fs";

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
