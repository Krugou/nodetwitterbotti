import crypto from 'crypto';
import {Client, Events, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';
import Jimp from 'jimp';
import {start} from 'repl';
const PREFIX = '!'; // You can change this to your desired command prefix.
const northurl =
	'https://aurorasnow.fmi.fi/public_service/images/latest_SIR.jpg';
const middleurl =
	'https://aurorasnow.fmi.fi/public_service/images/latest_SIR_AllSky.jpg';
const southurl =
	'https://aurorasnow.fmi.fi/public_service/images/latest_HOV.jpg';

const auroradatanew =
	'https://cdn.fmi.fi/weather-observations/products/magnetic-disturbance-observations/map-latest-fi.png';
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
		startMessageChannel.bulkDelete(1);
	}, 20 * 60 * 1000);
	const hasImageChanged = async (southurl) => {
		const response = await fetch(southurl);
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
	const sendMessages = async (textChannel) => {
		await textChannel.send({files: [northurl]});
		await textChannel.send('Nyrölä Observatory, Finland');
		await textChannel.send({files: [middleurl]});
		await textChannel.send('Hankasalmi observatory Jyväskylän Sirius ry');
		await textChannel.send({files: [southurl]});
		await textChannel.send('Metsähovin radiotutkimusasema(Aalto yliopisto)');
		await textChannel.send({files: [auroradatanew]});
	};
	const checkImageColor = async (image) => {
		let containsColor = false;
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

					// Check for #EE6777
					if (red === 238 && green === 103 && blue === 119) {
						containsColor = true;
						startMessageChannel.send({files: [auroradatanew]});
						startMessageChannel.send('Aurora change high ');
					}
					// Check for #CDBA44
					else if (red === 205 && green === 186 && blue === 68) {
						containsColor = true;
						startMessageChannel.send({files: [auroradatanew]});
						startMessageChannel.send('Aurora change low ');
					}

					if (x === image.bitmap.width - 1 && y === image.bitmap.height - 1) {
						resolve();
					}
				}
			);
		});
		return containsColor;
	};

	const postImage = async (channelID, southurl) => {
		const channel = jakbot.channels.cache.get(channelID);
		if (!channel) return console.error('The channel does not exist!');

		const latitude = 60.218393049680394; // Define latitude
		const longitude = 24.39386623193809; // Define longitude

		const {sunriseHours, sunsetHours} = await getSunriseSunsetTimes(
			latitude,
			longitude
		);

		if (await hasImageChanged(southurl)) {
			console.log('Image has changed');
			startMessageChannel.send('Image has changed');
			const utcHours = new Date().getUTCHours();
			if (utcHours < sunriseHours || utcHours > sunsetHours) {
				await startMessageChannel.send({files: [southurl]});
				const image = await Jimp.read(auroradatanew);
				const containsColor = await checkImageColor(image);

				if (containsColor) {
					const textChannel = channel;
					sendMessages(textChannel);
					console.log(`Posting image to channel ${textChannel}...`);
					startMessageChannel.send(
						`Posting image to channel ${textChannel}...`
					);
				} else {
					startMessageChannel.send(
						"Image doesn't contain #EE6777 or #CDBA44, skipping image post."
					);
					console.log(
						"Image doesn't contain #EE6777 or #CDBA44, skipping image post."
					);
				}
			} else {
				startMessageChannel.send(
					"It's not sunrise or sunset, skipping image post."
				);
				console.log("It's not sunrise or sunset, skipping image post.");
			}
		} else {
			startMessageChannel.send('Image has not changed, skipping image post.');
			console.log('Image has not changed, skipping image post.');
		}
	};

	postImage(channelID, southurl);
	const intervalInMilliseconds = 2 * 60 * 1000; // 2 minutes
	setInterval(() => postImage(channelID, southurl), intervalInMilliseconds);
});
