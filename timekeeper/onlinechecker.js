import 'discord-reply';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelID = '1085880960882589718';

jakbot.login(process.env.DISCORD_TOKEN);
jakbot.once(Events.ClientReady, c => {
    // console.log(`Ready! Logged in as ${c.user.tag}`);

});
const deleteMessages = () => {
    jakbot.on('ready', jakbot => {
        const channel = jakbot.channels.cache.get(channelID);
        channel.messages.fetch({ limit: 25 })
            .then(messages => {
                // Delete the messages
                channel.bulkDelete(messages);
            })
            .catch(console.error);
    });
}

const onlineChecker = () => {
    jakbot.on('ready', jakbot => {
        jakbot.user.setUsername('Onlinechecker');
        jakbot.user.setActivity('Nodejs', { type: 'PLAYING' });
// check if https://media.mw.metropolia.fi/wbma/media/ is online
        fetch('https://media.mw.metropolia.fi/wbma/media/', {
            method: 'GET',
            headers: {

                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                jakbot.channels.cache.get(channelID).
                    send('https://media.mw.metropolia.fi/wbma/media/ is online');
            })
            .catch(error => {
                jakbot.channels.cache.get(channelID). 
                    send('https://media.mw.metropolia.fi/wbma/media/ is offline');
            });
        
  
    });
};
// every 6 hours in ms 21600000
setInterval(deleteMessages, 21600000);
// every 2 hours in ms 7200000
setInterval(onlineChecker, 7200000);
onlineChecker();







