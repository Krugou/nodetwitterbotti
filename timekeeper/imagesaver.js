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
		const urlSunriseSunset = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}}`;

		// Fetch the data
		const response = await fetch(urlSunriseSunset);
		const data = await response.json();

		// Log the response
		console.log(data);

		const {sunrise, sunset} = data.results;
		const time = sunrise || sunset;
		const [hours, minutes, seconds] = time.split(/[:\s]/);
		const date = new Date();
		date.setUTCHours(hours > 12 ? hours - 12 : hours, minutes, seconds);
		console.log('🚀 ~ file: imagesaver.js:33 ~ jakbot.on ~ sunset:', sunset);
		console.log('🚀 ~ file: imagesaver.js:33 ~ jakbot.on ~ sunrise:', sunrise);
		const sunriseDate = new Date(`1970-01-01T${sunrise}Z`);
		const sunrise24h = sunriseDate.getUTCHours();
		console.log(
			'🚀 ~ file: imagesaver.js:37 ~ jakbot.on ~ sunrise24h:',
			sunrise24h
		);
		const sunsetDate = new Date(`1970-01-01T${sunset}Z`);
		const sunset24h = sunsetDate.getUTCHours();
		console.log(
			'🚀 ~ file: imagesaver.js:40 ~ jakbot.on ~ sunset24h:',
			sunset24h
		);

		// Get the current hour
		const currentHour = new Date().getUTCHours();
		console.log(
			'🚀 ~ file: imagesaver.js:50 ~ jakbot.on ~ currentHour:',
			currentHour
		);

		// Check if it is currently during sunrise or sunset
		if (currentHour >= sunrise24h && currentHour <= sunset24h) {
			// Send the image to the channel.
			const textChannel = channel;
			textChannel.send({files: [url]});
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
