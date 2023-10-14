import {Client, Events, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const PREFIX = '!'; // You can change this to your desired command prefix.
const url = 'https://aurorasnow.fmi.fi/public_service/images/latest_HOV.jpg';
const channelIDImage = '1020376168496627742';

const jakbot = new Client({intents: [GatewayIntentBits.Guilds]});
jakbot.login(process.env.DISCORD_TOKEN);

const postImageEvery30Minutes = (channelID, url) => {
	console.log(`Posting image to channel ${channelID}...`);
	const channel = jakbot.channels.cache.get(channelID);
	if (!channel) return console.error('The channel does not exist!');

	const now = new Date();
	const hours = now.getHours();

	if (hours >= 17 || hours < 4) {
		channel.send({files: [url]});
	} else {
		console.log("It's not nighttime, skipping image post.");
	}
};

jakbot.on('ready', () => {
	postImageEvery30Minutes(channelIDImage, url);
	const intervalInMilliseconds = 30 * 60 * 1000; // 30 minutes
	setInterval(
		() => postImageEvery30Minutes(channelIDImage, url),
		intervalInMilliseconds
	);

	const checkReservations = (channelID, nameofgroup) => {
		fetch('https://opendata.metropolia.fi/r1/reservation/search', {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + btoa(process.env.APIKEYMETROPOLIA),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				studentGroup: [nameofgroup],
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				const today = new Date();
				jakbot.channels.cache
					.get(channelID)
					.send('\0 \n Date Today: ' + today.toISOString().substring(0, 10));
				const lastReservation = data.reservations[data.reservations.length - 1];
				const lastReservationDate = new Date(lastReservation.startDate);
				const daysUntilLastReservation =
					(lastReservationDate - today) / 1000 / 60 / 60 / 24;
				const daysUntilLastReservationRounded = Math.floor(
					daysUntilLastReservation
				);
				let totalHoursLeft = 0;

				for (let i = 0; i < data.reservations.length; i++) {
					const dateStr = data.reservations[i].startDate;
					const date = new Date(dateStr);
					const fiveDaysFromNow = new Date(
						today.getTime() + 5 * 24 * 60 * 60 * 1000
					);
					const isBetweenTodayAndFiveDaysFromNow =
						date >= today && date <= fiveDaysFromNow;
					const betweenNowAndInfinite = date >= today;

					if (betweenNowAndInfinite) {
						const endDate1 = data.reservations[i].endDate;
						const endTime1 = endDate1.substring(11, 16);
						const time1 = dateStr.substring(11, 16);
						const date1 = dateStr.substring(0, 10);
						const startDateTime1 = new Date(dateStr);
						const endDateTime1 = new Date(endDate1);
						const hoursDiff = (endDateTime1 - startDateTime1) / 3600000;
						totalHoursLeft += hoursDiff;
					}

					if (isBetweenTodayAndFiveDaysFromNow) {
						const endDate = data.reservations[i].endDate;
						const endTime = endDate.substring(11, 16);
						const time = dateStr.substring(11, 16);
						const date = dateStr.substring(0, 10);
						const startDateTime = new Date(dateStr);
						const endDateTime = new Date(endDate);
						const hoursDiff = (endDateTime - startDateTime) / 3600000;
						const subjectsCount = data.reservations.length;
						const currentSubjectIndex = i;
						const resources = data.reservations[i].resources;
						const room = resources.find((resource) => resource.type === 'room');
						jakbot.channels.cache
							.get(channelID)
							.send(
								'\0 \n Id: ' +
									data.reservations[i].id +
									'\n Date: ' +
									date +
									'\n Subject: ' +
									data.reservations[i].subject +
									'\n Start Time: ' +
									time +
									'\n End Time: ' +
									endTime +
									'\n ' +
									`Count: ${currentSubjectIndex}/${subjectsCount}.` +
									'\n Left:  ' +
									(subjectsCount - currentSubjectIndex - 1) +
									'\n Duration: ' +
									hoursDiff.toFixed(2) +
									' hours' +
									(room
										? ` \n Room: ${room.code} // ${room.name}`
										: '\n Remote teaching.')
							);
					}
				}

				jakbot.channels.cache
					.get(channelID)
					.send(
						`\0 \n Total curriculum hours left: ${totalHoursLeft} \n Total actual days left:  ${daysUntilLastReservationRounded}`
					);

				if (data.reservations.length === 0) {
					jakbot.channels.cache
						.get(channelID)
						.send(
							"\0 \n Looks like a black hole just appeared and swallowed all the reservations in the future. Guess it's time to break out the popcorn and watch time unravel from the comfort of your couch!"
						);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	checkReservations(channelID, 'tvt21-m');

	const channelIDKaramalmi = '1087689568549097567';
	const channelIDKaramalmilogs = '1088015207210696714';

	const checkMenu = (id, language, channelID) => {
		fetch(
			'https://www.compass-group.fi/menuapi/feed/json?costNumber=' +
				id +
				'&language=' +
				language
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.MenusForDays[0].SetMenus.length > 0) {
					jakbot.channels.cache
						.get(channelID)
						.send(
							' \0 \n Nimi: ' +
								data.RestaurantName +
								'\n Päiväys: ' +
								data.MenusForDays[0].Date +
								'\n Lounasaika: ' +
								data.MenusForDays[0].LunchTime +
								'\n Linkki:' +
								data.RestaurantUrl +
								'\n ' +
								data.Footer +
								'\n '
						);
					for (let j = 0; j < data.MenusForDays[0].SetMenus.length; j++) {
						for (
							let i = 0;
							i < data.MenusForDays[0].SetMenus[j].Components.length;
							i++
						) {
							jakbot.channels.cache
								.get(channelID)
								.send(data.MenusForDays[0].SetMenus[j].Components[i]);
						}
						jakbot.channels.cache
							.get(channelID)
							.send(
								'\n Hinnat: ' + data.MenusForDays[0].SetMenus[j].Price + '€'
							);
					}
					jakbot.channels.cache
						.get(channelID)
						.send(
							'(G) Gluteeniton, (L) Laktoositon, (VL) Vähälaktoosinen, (M) Maidoton, (*) Suomalaisten ravitsemussuositusten mukainen, (Veg) Soveltuu vegaaniruokavalioon, (ILM) Ilmastoystävällinen, (VS) Sis. tuoretta valkosipulia, (A) Sis. Allergeeneja'
						);
				} else {
					jakbot.channels.cache
						.get(channelID)
						.send(
							' \0 \n Nimi: ' +
								data.RestaurantName +
								'\n Päiväys: ' +
								data.MenusForDays[0].Date +
								'\n Lounasaika: ' +
								data.MenusForDays[0].LunchTime +
								'\n Linkki:' +
								data.RestaurantUrl +
								'\n ' +
								data.Footer +
								'\n '
						);
					jakbot.channels.cache.get(channelID).send('Ei lounasta tänään');
				}
			});
	};

	checkMenu(3208, 'fi', channelIDKaramalmi);
	checkMenu(3208, 'fi', channelIDKaramalmilogs);

	const channelIDShowcase = '1085880960882589718';
	const showcase = '1093786088482541679';
	const showcaseLogs = '1095228390212120626';

	const deleteMessages = () => {
		const channel1 = jakbot.channels.cache.get(channelIDShowcase);
		channel1.messages
			.fetch({limit: 25})
			.then((messages) => {
				channel1.bulkDelete(messages);
			})
			.catch(console.error);

		const channel2 = jakbot.channels.cache.get(showcase);
		channel2.messages
			.fetch({limit: 100})
			.then((messages) => {
				channel2.bulkDelete(messages);
				console.log('deleted messages');
			})
			.catch(console.error);
	};

	const onlineChecker = (limit) => {
		jakbot.user.setUsername('Onlinechecker');
		jakbot.user.setActivity('Nodejs', {type: 'PLAYING'});
		fetch('https://media.mw.metropolia.fi/wbma/media?limit=' + limit, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				data = data.reverse();
				for (let i = 0; i < data.length; i++) {
					jakbot.channels.cache
						.get(showcase)
						.send(
							' \0 \n' +
								i +
								'/' +
								(data.length - 1) +
								'\n https://media.mw.metropolia.fi/wbma/uploads/' +
								data[i].filename +
								' \n Description: ' +
								data[i].description +
								' \n Title: ' +
								data[i].title +
								' \n Time added: ' +
								data[i].time_added +
								' \n Mime type: ' +
								data[i].mime_type +
								' \n Media type: ' +
								data[i].media_type +
								' \n User id: ' +
								data[i].user_id +
								' \n File Size: ' +
								data[i].filesize +
								' \n File id: ' +
								data[i].file_id +
								' \n Filename: ' +
								data[i].filename +
								' \n '
						);
					jakbot.channels.cache
						.get(showcaseLogs)
						.send(
							' \0 \n' +
								i +
								'/' +
								(data.length - 1) +
								'\n https://media.mw.metropolia.fi/wbma/uploads/' +
								data[i].filename +
								' \n Description: ' +
								data[i].description +
								' \n Title: ' +
								data[i].title +
								' \n Time added: ' +
								data[i].time_added +
								' \n Mime type: ' +
								data[i].mime_type +
								' \n Media type: ' +
								data[i].media_type +
								' \n User id: ' +
								data[i].user_id +
								' \n File Size: ' +
								data[i].filesize +
								' \n File id: ' +
								data[i].file_id +
								' \n Filename: ' +
								data[i].filename +
								' \n '
						);
				}
				jakbot.channels.cache
					.get(channelIDShowcase)
					.send(
						' \0 \n https://media.mw.metropolia.fi/wbma/media/ is online \n '
					);
			})
			.catch((error) => {
				jakbot.channels.cache
					.get(channelIDShowcase)
					.send(
						" \0 \n Well shucks, that there fancy website at https://media.mw.metropolia.fi/wbma/media/ seems to be plumb offline! We best be hollerin' at ol' Matti Peltoniemi to get it fixed up right quick!"
					);
			});
	};

	deleteMessages();
	onlineChecker(300);
});
