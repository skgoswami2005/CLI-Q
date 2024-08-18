import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "..", "..", "config.json");

export const getApiKey = () => {
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return config.apiKey || null;
};

export const setApiKey = (apiKey) => {
  const config = { apiKey };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("API key set successfully!");
};

export const deleteApiKey = () => {
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
    console.log("API key deleted successfully!");
  } else {
    console.log("No API key found to delete.");
  }
};
