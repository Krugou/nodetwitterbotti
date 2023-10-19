import {Client, Events, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';

const PREFIX = '!'; // You can change this to your desired command prefix.
const url = 'https://aurorasnow.fmi.fi/public_service/images/latest_HOV.jpg';
const channelID = '1020376168496627742';
const jakbot = new Client({intents: [GatewayIntentBits.Guilds]});
jakbot.login(process.env.DISCORD_TOKEN);
jakbot.on('ready', () => {
	// Function to post the specified image every 30 minutes
	const postImageEvery30Minutes = async (channelID, url) => {
		// Removed extra async
		console.log(`Posting image to channel ${channelID}...`);
		const channel = jakbot.channels.cache.get(channelID); // Replace with your channel ID
		if (!channel) return console.error('The channel does not exist!');

		// Get the current date and time in UTC
		const now = new Date().toISOString();
		const latitude = 60.218393049680394; // Define latitude
		const longitude = 24.39386623193809; // Define longitude

		// Construct the URL
		const urlSunriseSunset = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${now
			.toISOString()
			.slice(0, 10)}`;

		// Fetch the data
		const response = await fetch(urlSunriseSunset);
		const data = await response.json();

		// Log the response
		console.log(data);

		const {sunrise, sunset} = data.results;

		// Convert sunrise and sunset times to Date objects
		const sunriseDate = new Date(
			`${now.toISOString().slice(0, 10)}T${sunrise}`
		);
		console.log(
			'🚀 ~ file: imagesaver.js:40 ~ postImageEvery30Minutes ~ sunriseDate:',
			sunriseDate
		);
		const sunsetDate = new Date(`${now.toISOString().slice(0, 10)}T${sunset}`);

		console.log(
			'🚀 ~ file: imagesaver.js:42 ~ postImageEvery30Minutes ~ sunsetDate:',
			sunsetDate
		);
		// Check if it is currently during sunrise or sunset
		if (now >= sunriseDate && now <= sunsetDate) {
			// Send the image to the channel.
			channel.send({files: [url]});
		} else {
			console.log("It's not sunrise or sunset, skipping image post.");
		}
	};

	// Set an interval to run the function every 30 minutes (in milliseconds)
	postImageEvery30Minutes(channelID, url);
	const intervalInMilliseconds = 30 * 60 * 1000; // 30 minutes
	setInterval(
		() => postImageEvery30Minutes(channelID, url),
		intervalInMilliseconds
	);
});
