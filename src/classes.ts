import { askMC } from "./inquirer";

export class Category {
  question: string;
  name: string;
  subcategories: Category[] | EndCategory[];
  constructor(name: string, question: string, subcategories: Category[]) {
    this.question = question;
    this.name = name;
    this.subcategories = subcategories;
  }

  async run() {
    const answer = await askMC(
      this.question,
      this.subcategories.map((category, idx) => {
        return { msg: category.name, value: idx };
      }),
    );

    this.subcategories[answer].run();
  }
}

export class EndCategory {
  question: string;
  name: string;
  subcategories: [];
  private answers: { msg: string; handler: () => void }[];
  constructor(
    name: string,
    question: string,
    answers: { msg: string; handler: () => void }[],
  ) {
    this.question = question;
    this.name = name;
    this.subcategories = [];
    this.answers = answers;
  }
  async run() {
    const answer = await askMC(
      this.question,
      this.answers.map((a, idx) => {
        return { msg: a.msg, value: idx };
      }),
    );

    this.answers[answer].handler();
  }
}
