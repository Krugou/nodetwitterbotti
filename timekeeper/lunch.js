import 'discord-reply';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelIDKaramalmi = '1087689568549097567';
const channelIDKaramalmilogs = '1088015207210696714';

jakbot.login(process.env.DISCORD_TOKEN);
jakbot.once(Events.ClientReady, c => {
  // console.log(`Ready! Logged in as ${c.user.tag}`);

});


jakbot.on('ready', jakbot => {
  const channel = jakbot.channels.cache.get(channelIDKaramalmi);
  channel.messages.fetch({ limit: 100 })
    .then(messages => {
      // Delete the messages
      channel.bulkDelete(messages);
    })
    .catch(console.error);
  jakbot.user.setUsername('LunchKeeper');
  jakbot.user.setActivity('Nodejs', { type: 'PLAYING' });
  // if today is monday
  const today = new Date();
  const day = today.getDay();
  if (day === 1) {
    jakbot.channels.cache.get(channelIDKaramalmi).
      send('Hello, I am the LunchKeeper,   have a nice week!');
  }
});



const checkMenu = (id, language, channelID) => {
  jakbot.on('ready', jakbot => {
    fetch('https://www.compass-group.fi/menuapi/feed/json?costNumber=' + id + '&language=' + language)
      .then(response => {
        return response.json();
      })
      .then(data => {
        jakbot.channels.cache.get(channelID).send(' -- \n Restaurant name: ' + data.RestaurantName + '\n Date: ' + data.MenusForDays[0].Date + '\n LunchTime: ' + data.MenusForDays[0].LunchTime + '\n Url to the Restaurant: ' + data.RestaurantUrl + '\n ' + data.Footer + '\n ');
        for (let j = 0; j < data.MenusForDays[0].SetMenus.length; j++) {
          for (let i = 0; i < data.MenusForDays[0].SetMenus[j].Components.length; i++) {
            jakbot.channels.cache.get(channelID).send('-- \n ' + data.MenusForDays[0].SetMenus[j].Components[i] + '\n prices: ' + data.MenusForDays[0].SetMenus[j].Price);
          }
          jakbot.channels.cache.get(channelID).send('(G) Gluteeniton, (L) Laktoositon, (VL) Vähälaktoosinen, (M) Maidoton, (*) Suomalaisten ravitsemussuositusten mukainen, (Veg) Soveltuu vegaaniruokavalioon, (ILM) Ilmastoystävällinen, (VS) Sis. tuoretta valkosipulia, (A) Sis. Allergeeneja');
        }
      });
  });
};







checkMenu(3208, 'fi', channelIDKaramalmi);
checkMenu(3208, 'fi', channelIDKaramalmilogs);
