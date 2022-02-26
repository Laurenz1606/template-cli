#! /usr/bin/env node
import { Category } from "./classes";
import { Create } from "./project";
import { Modules } from "./modules";

const Global = new Category("global", "What do you want to do?", [
  Create,
  Modules,
]);

Global.run();
