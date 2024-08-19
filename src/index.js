#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { setApiKey, getApiKey, deleteApiKey } from "./utils/api.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import clipboardy from "clipboardy";
import ora from "ora";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(getApiKey());
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

program
  .version("0.1.0")
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
    // Check OS of the computer
    var opsys = process.platform;
    if (opsys == "darwin") {
      opsys = "MacOS";
    } else if (opsys == "win32") {
      opsys = "Windows";
    } else if (opsys == "linux") {
      opsys = "Linux";
    }

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

        Generate only command, don't write any discription or text. omit any prefix like bash or any ohther
        OS: ${opsys}
    `;
    try {
      const spinner = ora("Generating command...").start();

      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

      const result = await model.generateContent(prompt);
      // console.log(result.response.text());

      spinner.succeed();

      if (!apiKey) {
        console.log(
          chalk.red(
            "API key is not set. Please set it first using set-api-key."
          )
        );
        return;
      }

      const generatedCommand = `${result.response.text()}`; // Replace with actual Gemini API call
      console.log(chalk.green(`Generated command: ${generatedCommand}`));

      // Ask the user if they want to copy the command
      const { copyCommand } = await inquirer.prompt([
        {
          type: "confirm",
          name: "copyCommand",
          message: "Do you want to copy this command to your clipboard?",
          default: true,
        },
      ]);

      if (copyCommand) {
        clipboardy.writeSync(generatedCommand);
        console.log(
          chalk.cyan(
            "Command copied to clipboard! You can now paste it into your terminal."
          )
        );
      }
    } catch (error) {
      spinner.fail("Failed to generate command.");
      console.log(chalk.red(`Error generating command: ${error.message}`));
    }
  });

// Delete API key
program
  .command("delete-api-key")
  .description("Delete the stored API key")
  .action(() => {
    deleteApiKey();
  });
program.parse(process.argv);
