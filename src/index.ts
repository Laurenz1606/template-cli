#! /usr/bin/env node
import { Category } from "./classes";
import { Projects } from "./projects";
import { Modules } from "./modules";

const Global = new Category("global", "What do you want to do?", [
  Projects,
  Modules,
]);

Global.run();
