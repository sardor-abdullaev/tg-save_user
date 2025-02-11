const { bot } = require('../bot');
const User = require('../model/user.model');

exports.saveUser = async ({
  first_name = 'unknown',
  last_name = 'unknown',
  chatId,
  username,
}) => {
  const newUser = new User({ first_name, last_name, chatId, username });
  await newUser.save();
};

exports.startMenu = (chatId) => {
  const text =
    "🫧Iltimos quyidagi savollarga javob bersangiz\n- Uskuna/Maxsulot  nomi va rasmi 📍\n- Uskuna/ Maxsulot  Soni 📌\n- Nima uchun mo'ljallangan 🔗\n- Sir soatda ishlab chiqarish hajmi 📏\n- Nima xomashyoda ishlaydi 📦\n- Ishlab chiqarish bo'yicha nima muammoingiz bor✂️\n- Nima yo'nalish bo'yicha Xitoydan narx olib solishtirmoxchisiz🗞\n- Qanday biznes bo'yicha ma'lumot olmoxchisiz📈\n- Xitoy bilan ishlash bo'yicha nima to'siqlarga duch keldingiz ⚠️\n- Sizga Xitoydan  qanday xomashyo kerak 🛄\n- Sizga qanday Extiyot qismlari kerak\n ▶️Telefon raqamingiz (Iloji bo'lsa) ⭕️\n\nYuqoridagilardan o'zingizga kerakli bo'limni tanlang. Hammasiga javob bermasangiz ham bo'ladi\nBizning manzil - /location";

  bot.sendMessage(chatId, text, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        // [{ text: 'Bizning lokatsiyamiz', request_location: true }],
        [{ text: 'Telefon raqamini ulashish', request_contact: true }],
      ],
    },
  });
};
