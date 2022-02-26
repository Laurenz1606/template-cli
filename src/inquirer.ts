import { prompt } from "inquirer";

export const askMC = async (
  question: string,
  answers: { value: any; msg: string }[],
) => {
  const x = await prompt({
    message: question,
    choices: answers.map((answer) => {
      return { value: answer.value, name: answer.msg };
    }),
    name: "answer",
    type: "list",
  });

  return x["answer"];
};
