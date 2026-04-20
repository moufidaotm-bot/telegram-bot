const express = require("express");
const app = express();

const TOKEN = "حط_التوكن_تاعك";

app.use(express.json());

app.post("/", async (req, res) => {
  const message = req.body.message;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;

    let reply = "";

    if (text === "/start") {
      reply = "مرحبا 👋 البوت خدام!";
    } else {
      reply = "راك قلت: " + text;
    }

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
      }),
    });
  }

  res.send("ok");
});

app.listen(3000, () => console.log("Bot running"));
