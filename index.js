require("dotenv").config();
const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("Bot is ready.");
});

client.on("message", (msg) => {
  if (msg.author.bot === true) return;
});

client.login(process.env.BOT_TOKEN).catch((err) => {
  console.error(`Error: ${err}`);
});
