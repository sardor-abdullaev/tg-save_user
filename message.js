const { bot } = require('./bot');
const User = require('./model/user.model');
const {
  saveUser,
  startMenu,
  showUsers,
  sendMsgToAdmins,
  sendAd,
} = require('./controller/user.controller');

bot.on('message', async (msg) => {
  // console.log(msg);

  const { first_name, last_name, username, id: chatId } = msg.from;
  const user = await User.findOne({ chatId });

  if (msg.contact) {
    user.phone_number = msg.contact.phone_number;
    await user.save();
    return;
  }
  if (user.action == 'sendad') {
    sendAd(chatId, msg.text);
    return;
  }
  //   console.log('test');
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
      }
      break;
    case '/location':
      bot.sendLocation(chatId, 41.251514, 69.21788);
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
});
