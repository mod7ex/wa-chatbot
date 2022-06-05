const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const handelMsg = require('./config')

//store authentication data to a file
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("ready", () => {
  console.log("Client is ready!");
});


client.on("message", async (message) => {

  const chat = await message.getChat();

  if([...chat.participants].length === 1) {
    message.reply(handelMsg(message.body));
  }

});