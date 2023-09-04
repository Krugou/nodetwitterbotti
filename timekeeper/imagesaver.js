import {Client, Events, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';


const PREFIX = '!'; // You can change this to your desired command prefix.
const url = 'https://aurorasnow.fmi.fi/public_service/images/latest_HOV.jpg';
const channelID = '1020376168496627742';
const jakbot = new Client({intents: [GatewayIntentBits.Guilds]});
jakbot.login(process.env.DISCORD_TOKEN);
jakbot.on('ready', () => {
    // Function to post the specified image every 30 minutes
    const postImageEvery30Minutes = (channelID, url) => {
        console.log(`Posting image to channel ${channelID}...`);
        const channel = jakbot.channels.cache.get(channelID); // Replace with your channel ID
        if (!channel) return console.error("The channel does not exist!");

        // Get the current time
        const now = new Date();
        const hours = now.getHours();

        // Check if it is nighttime (between 10pm and 6am)
        if (hours >= 17 || hours < 4) {
            // Send the image to the channel.
            channel.send({files: [url]});
        } else {
            console.log("It's not nighttime, skipping image post.");
        }
    };

    // Set an interval to run the function every 30 minutes (in milliseconds)
    postImageEvery30Minutes(channelID, url);
    const intervalInMilliseconds = 30 * 60 * 1000; // 30 minutes
    setInterval(() => postImageEvery30Minutes(channelID, url), intervalInMilliseconds);
});






