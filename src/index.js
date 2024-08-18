#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { setApiKey, getApiKey, deleteApiKey } from "./utils/api.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(getApiKey());
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

program
  .version("1.0.0")
  .description("A simple CLI tool to generate a random password");

program.command("hi").action(() => {
  console.log("Hello, World!");
});

// Set API key
program
  .command("set-api-key")
  .description("Set the API key for the Gemini service")
  .action(async () => {
    const { apiKey } = await inquirer.prompt([
      { type: "input", name: "apiKey", message: "Enter the API key:" },
    ]);
    setApiKey(apiKey);
  });

// Generate command from text
program
  .command("generate-command")
  .description("Generate a command from text input")
  .action(async () => {
    const { text } = await inquirer.prompt([
      {
        type: "input",
        name: "text",
        message: "Enter the text to generate command from:",
      },
    ]);
    const apiKey = getApiKey();
    const prompt = `Generate commad for following query:
        ${text}

        Generate only command, don't write any discription or text.
    `;

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());

    if (!apiKey) {
      console.log(
        chalk.red("API key is not set. Please set it first using set-api-key.")
      );
      return;
    }

    const generatedCommand = `${result.response.text()}`; // Replace with actual Gemini API call
    console.log(chalk.green(`Generated command: ${generatedCommand}`));

    // const { save } = await inquirer.prompt([
    //   {
    //     type: "confirm",
    //     name: "save",
    //     message: "Do you want to save this command?",
    //     default: false,
    //   },
    // ]);
    // if (save) {
    //   const { name } = await inquirer.prompt([
    //     {
    //       type: "input",
    //       name: "name",
    //       message: "Enter a name for this command:",
    //     },
    //   ]);
    //   saveCommand(name, generatedCommand);
    // }
  });

// Delete API key
program
  .command("delete-api-key")
  .description("Delete the stored API key")
  .action(() => {
    deleteApiKey();
  });
program.parse(process.argv);
