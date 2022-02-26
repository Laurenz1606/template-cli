import { Category, EndCategory } from "./classes";

const modules = new EndCategory(
  "Add Modules",
  "What type of module do you want to add?",
  [{ msg: "Express Router", handler: () => console.log("Router") }],
);

const global = new Category("global", "What do you want to do?", [modules]);

global.run();
