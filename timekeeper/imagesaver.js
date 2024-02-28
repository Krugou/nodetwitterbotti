import crypto from 'crypto';
import {Client, Events, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';
import Jimp from 'jimp';
import {start} from 'repl';
const PREFIX = '!'; // You can change this to your desired command prefix.
const muonio = 'https://aurorasnow.fmi.fi/public_service/images/latest_MUO.jpg';
const nyrola = 'https://aurorasnow.fmi.fi/public_service/images/latest_SIR.jpg';
const hankasalmi =
	'https://aurorasnow.fmi.fi/public_service/images/latest_SIR_AllSky.jpg';
const metsahovi =
	'https://aurorasnow.fmi.fi/public_service/images/latest_HOV.jpg';

const auroradatanew =
	'https://cdn.fmi.fi/weather-observations/products/magnetic-disturbance-observations/map-latest-fi.png';
// const auroradatanew = 'https://users.metropolia.fi/~aleksino/map-latest-fi.png';
const channelID = '1020376168496627742';
const jakbot = new Client({intents: [GatewayIntentBits.Guilds]});
jakbot.login(process.env.DISCORD_TOKEN);
let previousHash = '';
jakbot.on('ready', () => {
	const startMessageChannelID = '1090689756553293885';

	const startMessageChannel = jakbot.channels.cache.get(startMessageChannelID);
	startMessageChannel.send(
		'imagesaver.js is now online! ',
		new Date().toISOString()
	);
	setTimeout(() => {
		startMessageChannel.bulkDelete(10);
	}, 20 * 60 * 1000);
	/**
	 * Checks if the image at the specified URL has changed.
	 * @param {string} metsahovi - The URL of the image to check.
	 * @returns {Promise<boolean>} - A promise that resolves to true if the image has changed, false otherwise.
	 */
	const sendLogMessage = (message) => {
		startMessageChannel.send(message);
		console.log(message);
	};
	const hasImageChanged = async (metsahovi) => {
		const response = await fetch(metsahovi);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const hash = crypto.createHash('sha1');
		hash.update(buffer);
		const currentHash = hash.digest('hex');
		if (previousHash !== currentHash) {
			previousHash = currentHash;
			return true;
		}
		return false;
	};
	/**
	 * Retrieves the sunrise and sunset times for a given latitude and longitude.
	 * @param {number} latitude - The latitude of the location.
	 * @param {number} longitude - The longitude of the location.
	 * @returns {Promise<{sunriseHours: number, sunsetHours: number}>} The sunrise and sunset hours in UTC format.
	 */
	const getSunriseSunsetTimes = async (latitude, longitude) => {
		// Construct the URL
		const urlSunriseSunset = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`;

		// Fetch the data
		const response = await fetch(urlSunriseSunset);
		const data = await response.json();

		const {sunrise, sunset} = data.results;

		const sunriseDate = convertTimeTo24HourFormat(sunrise);
		const sunsetDate = convertTimeTo24HourFormat(sunset);

		const sunriseHours = sunriseDate.getUTCHours();
		const sunsetHours = sunsetDate.getUTCHours();

		return {sunriseHours, sunsetHours};
	};
	/**
	 * Converts a time string to 24-hour format.
	 * @param {string} time - The time string in the format "HH:MM:SS AM/PM".
	 * @returns {Date} - The converted time in 24-hour format as a Date object.
	 */
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
	/**
	 * Sends messages with image files to the specified text channel.
	 * @param {TextChannel} textChannel - The text channel to send the messages to.
	 * @returns {Promise<void>} - A promise that resolves when all messages are sent.
	 */
	const sendMessages = async (textChannel) => {
		await textChannel.send({files: [muonio]});
		await textChannel.send('Muonio, Finland');
		await textChannel.send('https://maps.app.goo.gl/rmr9YMBuR66GCB2X8');
		await textChannel.send({files: [nyrola]});
		await textChannel.send('Nyrölä Observatory, Finland');
		await textChannel.send('https://maps.app.goo.gl/m9AHq8wxAhJyBVUMA');
		await textChannel.send({files: [hankasalmi]});
		await textChannel.send('Hankasalmi observatory Jyväskylän Sirius ry');
		await textChannel.send('https://maps.app.goo.gl/sDCpGgSkcMKgDojh6');
		await textChannel.send({files: [metsahovi]});
		await textChannel.send('Metsähovin radiotutkimusasema(Aalto yliopisto)');
		await textChannel.send('https://maps.app.goo.gl/BG3JC7uHLLcdi5C1A');
		await textChannel.send({files: [auroradatanew]});
		await textChannel.send(
			'https://www.ilmatieteenlaitos.fi/revontulet-ja-avaruussaa'
		);
	};
	/**
	 * Checks if an image contains specific colors and performs actions accordingly.
	 * @param {Image} image - The image to be checked.
	 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the image contains the specified colors.
	 */
	const checkImageColor = async (image) => {
		let containsColor = false;
		let highMessageSent = false;
		let lowMessageSent = false;

		await new Promise((resolve, reject) => {
			image.scan(
				0,
				0,
				image.bitmap.width,
				image.bitmap.height,
				function (x, y, idx) {
					const red = this.bitmap.data[idx + 0];
					const green = this.bitmap.data[idx + 1];
					const blue = this.bitmap.data[idx + 2];

					// Check for #EE6677
					if (red === 238 && green === 102 && blue === 119) {
						containsColor = true;
						if (!highMessageSent) {
							sendLogMessage(`Aurora change high`);
							highMessageSent = true;
						}
					}
					// Check for #CDBA44
					else if (red === 204 && green === 187 && blue === 68) {
						containsColor = true;
						if (!lowMessageSent) {
							sendLogMessage(`Aurora change low`);
							lowMessageSent = true;
						}
					}

					if (x === image.bitmap.width - 1 && y === image.bitmap.height - 1) {
						resolve();
					}
				}
			);
		});
		return containsColor;
	};

	/**
	 * Posts an image to a specified channel based on sunrise and sunset times.
	 * @param {string} channelID - The ID of the channel to post the image in.
	 * @param {string} metsahovi - The URL of the image to be posted.
	 * @returns {Promise<void>} - A promise that resolves once the image is posted.
	 */
	const postImage = async (channelID, metsahovi) => {
		const channel = jakbot.channels.cache.get(channelID);
		if (!channel) return console.error('The channel does not exist!');

		const latitude = 60.218393049680394; // Define latitude
		const longitude = 24.39386623193809; // Define longitude

		const {sunriseHours, sunsetHours} = await getSunriseSunsetTimes(
			latitude,
			longitude
		);

		const utcHours = new Date().getUTCHours();
		if (utcHours < sunriseHours || utcHours > sunsetHours) {
			await startMessageChannel.send({files: [metsahovi]});
			const image = await Jimp.read(auroradatanew);
			const containsColor = await checkImageColor(image);

			if (containsColor) {
				if (await hasImageChanged(metsahovi)) {
					sendLogMessage(`Image has changed`);
					sendMessages(channel);
					sendLogMessage(`Posting image to channel ${textChannel}...`);
				} else {
					sendLogMessage(`Image has not changed, skipping image post.`);
				}
			} else {
				sendLogMessage(
					`Image doesn't contain #EE6677 or #CDBA44, skipping image post.`
				);
			}
		} else {
			sendLogMessage(
				`Sun is out (it's between sunrise and sunset), skipping image post.`
			);
		}
	};

	postImage(channelID, metsahovi);
	const intervalInMilliseconds =
		(Math.floor(Math.random() * 10) + 1) * 60 * 1000; // 1 to 10 minutes
	setInterval(() => postImage(channelID, metsahovi), intervalInMilliseconds);
});
