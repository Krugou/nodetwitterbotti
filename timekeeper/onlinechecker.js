import 'discord-reply';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelID = '1085880960882589718';
const showcase = '1093786088482541679';

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

        const channel2 = jakbot.channels.cache.get(showcase);
        channel2.messages.fetch({ limit: 100 })
            .then(messages => {
                // Delete the messages
                channel2.bulkDelete(messages);
                console.log('deleted messages');

            })
            .catch(console.error);
    });
};

const onlineChecker = () => {
    jakbot.on('ready', jakbot => {
        // jakbot.user.setUsername('Onlinechecker');
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

                // for loop to send all files
                for (let i = 0; i < data.length; i++) {
                    jakbot.channels.cache.get(showcase).send(' \0 \n https://media.mw.metropolia.fi/wbma/uploads/' + data[i].filename + ' \n ' + data[i].description + ' \n ' + data[i].title + ' \n ' + data[i].time_added + ' \n ' + data[i].mime_type + ' \n ' + data[i].media_type + ' \n ' + data[i].user_id + ' \n ' + data[i].filesize + ' \n ' + data[i].file_id + ' \n ' + data[i].filename + ' \n ');
                }
                jakbot.channels.cache.get(channelID).
                    send(' \0 \n https://media.mw.metropolia.fi/wbma/media/ is online \n ');
            })
            .catch(error => {
                jakbot.channels.cache.get(channelID).
                    send(" \0 \n Well shucks, that there fancy website at https://media.mw.metropolia.fi/wbma/media/ seems to be plumb offline! We best be hollerin' at ol' Matti Peltoniemi to get it fixed up right quick!");
            });


    });
};

deleteMessages();

onlineChecker();







