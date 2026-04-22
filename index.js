const express = require("express");
const app = express();

const TOKEN = "8620221086:AAFjQUKcdpo1a1ThRtBgLHAwBVo9CZeK2yE";
const ADMIN_CHAT_ID = "7442685788";

let users = {};

app.use(express.json());

app.post("/", async (req, res) => {
  const message = req.body.message;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;

    

    if (!users[chatId]) users[chatId] = { step: 0 };

    let reply = "";

    if (text === "/start") {
      users[chatId].step = 1;
      reply = "👋 مرحبا\nنصمم تطبيقات ومواقع احترافية\n\nوش تحب؟\n1- تطبيق 📱\n2- موقع 🌐";
    }

    else if (users[chatId].step === 1) {
      users[chatId].type = text;
      users[chatId].step = 2;
      reply = "📌 صفلي المشروع تاعك";
    }

    else if (users[chatId].step === 2) {
      users[chatId].idea = text;
      users[chatId].step = 3;
      reply = "💰 الميزانية تاعك؟";
    }

    else if (users[chatId].step === 3) {
      users[chatId].budget = text;
      users[chatId].step = 4;
      reply = "📞 رقم الهاتف";
    }

    else if (users[chatId].step === 4) {
      users[chatId].phone = text;

      reply = "✅ تم تسجيل طلبك، راح نتواصل معاك قريب";

      // 🚀 إرسال الطلب ليك
      let adminMsg = `
🔥 Client جديد

📱 النوع: ${users[chatId].type}
💡 الفكرة: ${users[chatId].idea}
💰 الميزانية: ${users[chatId].budget}
📞 الهاتف: ${users[chatId].phone}
      `;

      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: adminMsg,
        }),
      });
    }

    else {
      reply = "اكتب /start";
    }

    // رد للمستخدم
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
