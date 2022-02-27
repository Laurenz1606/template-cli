import { prompt } from "inquirer";

export const askMC = async (
  question: string,
  answers: { value: any; msg: string }[],
) => {
  return (
    await prompt({
      message: question,
      choices: answers.map((answer) => {
        return { value: answer.value, name: answer.msg };
      }),
      name: "answer",
      type: "list",
    })
  ).answer;
};

export const ask = async (question: string): Promise<string> => {
  return (await prompt({ message: question, type: "input", name: "answer" }))
    .answer;
};

export const askC = async (question: string) => {
  return (await prompt({ message: question, type: "confirm", name: "answer" }))
    .answer;
};
