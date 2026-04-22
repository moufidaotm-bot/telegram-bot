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
    let keyboard = null;

    // 🟢 START + MENU
    if (text === "/start") {
      users[chatId] = { step: 1 };

      reply = "👋 مرحبا\nنصمم تطبيقات ومواقع احترافية\n\nاختار:";

      keyboard = {
        keyboard: [
          ["📱 تطبيق", "🌐 موقع"],
          ["💼 شوف أعمالي", "📞 تواصل معي"]
        ],
        resize_keyboard: true
      };
    }

    // 🟢 اختيار الخدمة
    else if (text === "📱 تطبيق" || text === "🌐 موقع") {
      users[chatId].type = text;
      users[chatId].step = 2;
      reply = "📌 صفلي المشروع تاعك";
    }

    // 🟢 Portfolio
    else if (text === "💼 شوف أعمالي") {
      reply = "🎨 أعمالي:\n- تطبيقات\n- مواقع\n\n📩 اطلب من /start";
    }

    // 🟢 Contact
    else if (text === "📞 تواصل معي") {
      reply = "📞 واتساب: 0783089765\nTelegram: @Moufidaotm";
    }

    // 🟢 الفكرة
    else if (users[chatId].step === 2) {
      users[chatId].idea = text;
      users[chatId].step = 3;
      reply = "💰 الميزانية تاعك؟";
    }

    // 🟢 الميزانية
    else if (users[chatId].step === 3) {
      users[chatId].budget = text;
      users[chatId].step = 4;
      reply = "📞 رقم الهاتف";
    }

    // 🟢 FINAL
    else if (users[chatId].step === 4) {
      users[chatId].phone = text;

      reply = "✅ تم تسجيل طلبك، راح نتواصل معاك قريب\n\n🔁 /start لطلب جديد";

      let adminMsg = `
🔥 Client جديد

📱 النوع: ${users[chatId].type}
💡 الفكرة: ${users[chatId].idea}
💰 الميزانية: ${users[chatId].budget}
📞 الهاتف: ${users[chatId].phone}
      `;

      await sendMessage(ADMIN_CHAT_ID, adminMsg);

      users[chatId] = { step: 0 };
    }

    else {
      reply = "اكتب /start";
    }

    // 🟢 إرسال
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        ...(keyboard && { reply_markup: keyboard })
      }),
    });
  }

  res.send("ok");
});

async function sendMessage(chat_id, text) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id,
      text,
    }),
  });
}

app.listen(3000, () => console.log("Bot running"));
