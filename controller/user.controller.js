const { admin } = require('../admin');
const { bot } = require('../bot');
const User = require('../model/user.model');

const isAdmin = (chatId) => {
  const setAdmin = new Set(admin);
  return setAdmin.has(chatId);
};

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
  const text = `🫧Iltimos quyidagi savollarga javob bersangiz\n- Uskuna/Maxsulot  nomi va rasmi 📍\n- Uskuna/ Maxsulot  Soni 📌\n- Nima uchun mo'ljallangan 🔗\n- Sir soatda ishlab chiqarish hajmi 📏\n- Nima xomashyoda ishlaydi 📦\n- Ishlab chiqarish bo'yicha nima muammoingiz bor✂️\n- Nima yo'nalish bo'yicha Xitoydan narx olib solishtirmoxchisiz🗞\n- Qanday biznes bo'yicha ma'lumot olmoxchisiz📈\n- Xitoy bilan ishlash bo'yicha nima to'siqlarga duch keldingiz ⚠️\n- Sizga Xitoydan  qanday xomashyo kerak 🛄\n- Sizga qanday Extiyot qismlari kerak\n ▶️Telefon raqamingiz (Iloji bo'lsa) ⭕️\n\nYuqoridagilardan o'zingizga kerakli bo'limni tanlang. Hammasiga javob bermasangiz ham bo'ladi\n\nBizning manzil - /location${
    isAdmin(chatId)
      ? "\nFoydalanuvchilar ro'yxati - /users\nReklama yozish - /sendad"
      : ''
  }`;

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

exports.showUsers = async (chatId) => {
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, "Sizga ruxsat yo'q", {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    return;
  }

  const users = await User.find();
  const usersText = users
    .map(
      (user, index) =>
        `${index + 1}.\nUsername - @${user.username}\nFirstname - ${
          user.first_name
        }\nLastname - ${user.last_name}${
          user.phone_number != 'unknown'
            ? '\nPhone  number - ' + user.phone_number
            : ''
        }`
    )
    .join('\n\n');
  // console.log(users);

  bot.sendMessage(chatId, usersText, {
    reply_markup: {
      remove_keyboard: true,
    },
  });
};

exports.sendMsgToAdmins = (username, msg) => {
  admin.forEach((adminChatId) => {
    bot.sendMessage(adminChatId, `@${username}\n${msg}`);
  });
};

exports.sendAd = async (chatId, msg = '') => {
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, "Sizga ruxsat yo'q", {
      reply_markup: { remove_keyboard: true },
    });
    return;
  }

  const user = await User.findOne({ chatId });
  if (user.action == 'sendad') {
    const users = await User.find();
    users.forEach((user) => {
      bot.sendMessage(user.chatId, msg);
    });
    user.action = '';
  } else {
    bot.sendMessage(chatId, "E'lonni yozing:(tekst formatda)", {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    user.action = 'sendad';
  }
  await user.save();
};
