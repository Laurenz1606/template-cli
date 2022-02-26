import { ask } from "../inquirer";
import { EndCategory } from "../classes";
import {
  copyAndReplaceFile,
  lowercaseFirstLetter,
  uppercaseFirstLetter,
} from "../utils";
import { join } from "path";
import { mkdirSync } from "fs";

export const Modules = new EndCategory(
  "Add Module",
  "What type of module do you want to add?",
  [
    { msg: "Express MiddleWare", handler: () => handler("MiddleWare") },
    { msg: "Express Router", handler: () => handler("Router") },
    { msg: "Mongoosee Model", handler: () => handler("Model") },
    { msg: "React Component", handler: () => handler("Component", true) },
    { msg: "React Context", handler: () => handler("Context", true) },
    { msg: "React Layout", handler: () => handler("Layout", true) },
    { msg: "React Page", handler: () => handler("Page", true) },
  ],
);

type ModuleTypes =
  | "Router"
  | "Model"
  | "MiddleWare"
  | "Context"
  | "Layout"
  | "Page"
  | "Component";

const handler = async (type: ModuleTypes, react?: boolean) => {
  const name = await ask(`What is the name of your ${type}?`);

  const typeWithS = type + "s";

  mkdirSync(join(process.cwd(), "src", typeWithS), { recursive: true });

  copyAndReplaceFile(
    join(__dirname, `${type}.txt`),
    join(
      process.cwd(),
      "src",
      typeWithS,
      `${name}${type}.ts${react ? "x" : ""}`,
    ),
    {
      _Name: uppercaseFirstLetter(name),
      _name: lowercaseFirstLetter(name),
    },
  );
};
