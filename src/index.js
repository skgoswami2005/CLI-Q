#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { setApiKey, getApiKey, deleteApiKey } from "./utils/api.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { exec } from "child_process";
import clipboardy from "clipboardy";

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

    try {
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
        clipboardy.writeSync(editedCommand);
        console.log(
          chalk.cyan(
            "Command copied to clipboard! You can now paste it into your terminal."
          )
        );
      }

      //   // Ask the user if they want to edit the command
      //   const { editedCommand } = await inquirer.prompt([
      //     {
      //       type: "editor",
      //       name: "editedCommand",
      //       message: "Edit the command if needed:",
      //       default: generatedCommand,
      //     },
      //   ]);

      //   // Ask the user if they want to execute the edited command
      //   const { execute } = await inquirer.prompt([
      //     {
      //       type: "confirm",
      //       name: "execute",
      //       message: "Do you want to execute this command?",
      //       default: false,
      //     },
      //   ]);

      //   if (execute) {
      //     // Execute the command using child_process.exec
      //     exec(editedCommand, (error, stdout, stderr) => {
      //       if (error) {
      //         console.log(chalk.red(`Error executing command: ${error.message}`));
      //         return;
      //       }
      //       if (stderr) {
      //         console.log(chalk.yellow(`Command stderr: ${stderr}`));
      //       }
      //       console.log(chalk.cyan(`Command output:\n${stdout}`));
      //     });
      //   }
    } catch (error) {
      console.log(chalk.red(`Error generating command: ${error.message}`));
    }

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
