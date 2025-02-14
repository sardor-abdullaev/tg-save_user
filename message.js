const { bot } = require('./bot');
const User = require('./model/user.model');
const {
  saveUser,
  startMenu,
  showUsers,
  sendMsgToAdmins,
  sendAd,
} = require('./controller/user.controller');
const { admin } = require('./admin');

bot.on('message', async (msg) => {
  // console.log(msg);

  const { first_name, last_name, username, id: chatId } = msg.from;
  const user = await User.findOne({ chatId });

  // contact
  if (msg.contact && msg.reply_to_message) {
    user.phone_number = msg.contact.phone_number;
    await user.save();
    return;
  }
  if (msg.contact) {
    admin.forEach((adminChatId) => {
      bot.sendContact(
        adminChatId,
        msg.contact.phone_number,
        msg.contact.first_name,
        {
          reply_markup: { remove_keyboard: true },
        }
      );
    });
    return;
  }

  // photo
  if (msg.photo) {
    admin.forEach((adminChatId) => {
      bot.sendPhoto(adminChatId, msg.photo[0].file_id, {
        reply_markup: { remove_keyboard: true },
      });
    });
    return;
  }

  // voice
  if (msg.voice) {
    admin.forEach((adminChatId) => {
      bot.sendAudio(adminChatId, msg.voice.file_id, {
        reply_markup: { remove_keyboard: true },
      });
    });
    return;
  }

  // video
  if (msg.video) {
    admin.forEach((adminChatId) => {
      bot.sendVideo(adminChatId, msg.video.file_id, {
        reply_markup: { remove_keyboard: true },
      });
    });
    return;
  }

  // video_note
  if (msg.video_note) {
    admin.forEach((adminChatId) => {
      bot.sendVideoNote(adminChatId, msg.video_note.file_id, {
        reply_markup: { remove_keyboard: true },
      });
    });
    return;
  }

  // document
  if (msg.document) {
    admin.forEach((adminChatId) => {
      bot.sendDocument(adminChatId, msg.document.file_id, {
        reply_markup: { remove_keyboard: true },
      });
    });
    return;
  }

  // audio
  if (msg.audio) {
    admin.forEach((adminChatId) => {
      bot.sendAudio(adminChatId, msg.audio.file_id, {
        reply_markup: { remove_keyboard: true },
      });
    });
    return;
  }

  if (msg.text) {
    //send ad
    if (user.action == 'sendad' && !msg.text.startsWith('/')) {
      sendAd(chatId, msg.text);
      return;
    }

    switch (msg.text) {
      case '/start':
        if (!user) {
          saveUser({ first_name, last_name, username, chatId });
          startMenu(chatId);
          return;
        } else {
          await User.findOneAndUpdate(
            { chatId },
            { first_name, last_name, username }
          );
          startMenu(chatId);
          return;
        }
      case '/location':
        bot.sendLocation(chatId, 41.251514, 69.21788, {
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      case '/users':
        showUsers(chatId);
        break;
      case '/sendad':
        sendAd(chatId);
        break;
      default:
        sendMsgToAdmins(username, msg.text);
        break;
    }
  }

  user.action = '';
  await user.save();
});
