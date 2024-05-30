const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");


const token = "7172041391:AAFyGEHQDFRC4ehAyg0h2T3MAor5Mhi5Dmc";
const webAppUrl = "https://peppy-crisp-8c6265.netlify.app";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json())
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, 'Нижче знаходиться кнопка "Відкрити форму', {
      reply_markup: {
        keyboard: [
          [{ text: "Відкрити форму", web_app: { url: webAppUrl + "/form" } }],
        ],
      },
    });

    await bot.sendMessage(chatId, "Зробити замовлення прямо зараз", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Зробити замовлення", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      bot.sendMessage(chatId, "Дякуюємо за заповнення форми")
      bot.sendMessage(chatId, 'Ваша країна: ' + data?.country);
      bot.sendMessage(chatId, 'Ваша вулиця: ' + data?.street);

      setTimeout( async () => {
        await  bot.sendMessage(chatId, "Всю інформацію ви отримаєте у даному чаті")
      }, 3000)
    } catch (err) {
      console.log(err);
    }
  }
});

app.post('/web-data', async () => {
    const {queryId, products, totalPrice} = req.body
    try {
        await  bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: "Успішне замовлення",
            input_message_content: {message_text: "Вітаємо з успішною покупкою, ви придбали товарів на: " + totalPrice},
        })
        return res.status(200).json({})
    }
    catch (err) {
        await  bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: "Замовлення не відправлено",
            input_message_content: {message_text: "Ваше замовлення не відправлено"},
        })
    }
    return res.status(500).json({})
})   
 const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});