import 'discord-reply';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelIDKaramalmi = '1087689568549097567';

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



const checkMenu = (id, language) => {
  jakbot.on('ready', jakbot => {
    fetch('https://www.compass-group.fi/menuapi/feed/json?costNumber=' + id + '&language=' + language)
      .then(response => {
        return response.json();
      })
      .then(data => {
        jakbot.channels.cache.get(channelIDKaramalmi).send('Restaurant name: ' + data.RestaurantName);
        jakbot.channels.cache.get(channelIDKaramalmi).send('Date: ' + data.MenusForDays[0].Date);
        jakbot.channels.cache.get(channelIDKaramalmi).send('LunchTime: ' + data.MenusForDays[0].LunchTime);

        jakbot.channels.cache.get(channelIDKaramalmi).send('Url to the Restaurant: ' + data.RestaurantUrl);
        jakbot.channels.cache.get(channelIDKaramalmi).send(data.Footer);
        jakbot.channels.cache.get(channelIDKaramalmi).send('------------------------------------------------------------------');
        for (let j = 0; j < data.MenusForDays[0].SetMenus.length; j++) {
          for (let i = 0; i < data.MenusForDays[0].SetMenus[j].Components.length; i++) {
            jakbot.channels.cache.get(channelIDKaramalmi).send(data.MenusForDays[0].SetMenus[j].Components[i]);
          }
          jakbot.channels.cache.get(channelIDKaramalmi).send('prices: ' + data.MenusForDays[0].SetMenus[j].Price);
          jakbot.channels.cache.get(channelIDKaramalmi).send('------------------------------------------------------------------');
        }
        jakbot.channels.cache.get(channelIDKaramalmi).send('(G) Gluteeniton, (L) Laktoositon, (VL) Vähälaktoosinen, (M) Maidoton, (*) Suomalaisten ravitsemussuositusten mukainen, (Veg) Soveltuu vegaaniruokavalioon, (ILM) Ilmastoystävällinen, (VS) Sis. tuoretta valkosipulia, (A) Sis. Allergeeneja');
      });
  });
};






checkMenu(3208, 'fi');
