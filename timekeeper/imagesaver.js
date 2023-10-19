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
		const now = new Date();
		// Get the current date and time in UTC
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
		const convertTimeTo24HourFormat = (time) => {
			const [hours, minutes, seconds, period] = time.split(/[:\s]/);
			const date = new Date();
			date.setUTCHours(
				period.toLowerCase() === 'pm' ? parseInt(hours) + 12 : hours,
				minutes,
				seconds
			);
			return date;
		};

		const sunriseDate = convertTimeTo24HourFormat(sunrise);
		const sunsetDate = convertTimeTo24HourFormat(sunset);

		const utcHours = now.getUTCHours();
		console.log(utcHours); // Output: current UTC hour
		const sunriseHours = sunriseDate.getUTCHours();
		console.log(sunriseHours); // Output: sunrise UTC hour
		const sunsetHours = sunsetDate.getUTCHours();
		console.log(sunsetHours); // Output: sunset UTC hour
		// Check if it is currently during sunrise or sunset
		if (utcHours >= sunriseHours && utcHours <= sunsetHours) {
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
