# CLI-Q

CLI-Q is a command-line tool designed to help developers generate commands from text input, set and manage API keys, and interact with a simple interface. This tool leverages Google Generative AI for generating accurate commands.

## Features

- **Set API Key**: Configure your API key for accessing Google Generative AI services.
- **Generate Commands from Text**: Convert plain text descriptions into shell commands.
- **Delete API Key**: Easily remove your stored API key.

## Installation

You can install CLI-Q globally using npm:

```bash
npm install -g cli-q
```

## Usage

After installing, use the tool by simply typing:

```bash
cli-q
```

To use the tool first create Google Gemini API from [Google AI Studio](https://aistudio.google.com/). Then login and get API key from Google AI Studio. After that set api key in tool and then you can use the tool.

### Available Commands

1. **Set API Key**: Set your API key for generating commands.

   ```bash
   cli-q set-api-key
   ```

2. **Generate Command**: Convert plain text into a command.

   ```bash
   cli-q generate-command
   ```

3. **Delete API Key**: Remove the stored API key.
   ```bash
   cli-q delete-api-key
   ```

## GitHub Repository

Find the complete source code and documentation on [GitHub](https://github.com/skgoswami2005/CLI-Q.git).
