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

    let reply = {};
    let keyboard;

    // 🟢 START
    if (text === "/start") {
      users[chatId] = { step: 0 };

      reply.text = "👋 مرحبا بيك\nأنا نعاونك تبني تطبيق أو موقع احترافي 💻\n\nاختار:";

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
      users[chatId].step = 1;

      reply.text = "📌 صفلي المشروع تاعك بالتفصيل";
    }

    // 🟢 الفكرة
    else if (users[chatId].step === 1) {
      users[chatId].idea = text;
      users[chatId].step = 2;

      reply.text = "💰 الميزانية تاعك؟ (مثال: 10000 دج)";
    }

    // 🟢 الميزانية
    else if (users[chatId].step === 2) {
      users[chatId].budget = text;
      users[chatId].step = 3;

      reply.text = "📞 رقم الهاتف أو واتساب";
    }

    // 🟢 FINAL
    else if (users[chatId].step === 3) {
      users[chatId].phone = text;

      reply.text = "✅ تم تسجيل طلبك، راح نتواصل معاك قريب\n\n🔁 اكتب /start لطلب جديد";

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

    // 🟢 Portfolio
    else if (text === "💼 شوف أعمالي") {
      reply.text = "🎨 أعمالي:\n\n- تطبيق إدارة\n- موقع تجارة إلكترونية\n\n📩 اطلب مشروعك من /start";
    }

    // 🟢 Contact
    else if (text === "📞 تواصل معي") {
      reply.text = "📞 تواصل مباشر:\nWhatsApp: 0783089765\nTelegram: @Moufidaotm";
    }

    else {
      reply.text = "⚠️ اكتب /start باش تبدا";
    }

    // 🔥 إرسال الرسالة + FIX MENU
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply.text,
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
