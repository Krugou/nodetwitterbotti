import 'discord-reply';
import {Client, Events, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({intents: [GatewayIntentBits.Guilds]});
const channelID = '1084944685568638976';
const logs = '1087029247501152297';

jakbot.login(process.env.DISCORD_TOKEN);
jakbot.once(Events.ClientReady, (c) => {
	// console.log(`Ready! Logged in as ${c.user.tag}`);
});

jakbot.on('ready', (jakbot) => {
	const startMessageChannelID = '1090689756553293885';
	const startMessageChannel = jakbot.channels.cache.get(startMessageChannelID);
	startMessageChannel.send(
		'timekeeper.js is now online! ',
		new Date().toISOString()
	);
	setTimeout(() => {
		startMessageChannel.bulkDelete(1);
	}, 20 * 60 * 1000);
	const channel = jakbot.channels.cache.get(channelID);
	channel.messages
		.fetch({limit: 100})
		.then((messages) => {
			// Delete the messages
			channel.bulkDelete(messages);
		})
		.catch(console.error);
	jakbot.user.setUsername('TimeKeeper');
	jakbot.user.setActivity('Nodejs', {type: 'PLAYING'});
	// if today is monday
	const today = new Date();
	const day = today.getDay();
	if (day === 1) {
		jakbot.channels.cache
			.get(channelID)
			.send(
				" \0 \n Hello, I am the TimeKeeper! I'm your trusty sidekick in the battle against tardiness.My circuits are synced to the atomic clock, so I always know what time it is.And don't worry about keeping track of your class schedule, I've got it covered! I'll beep-boop you a friendly reminder when it's time to stop slacking off and start learning. Now, let's make this week as productive as a robot on a caffeine high! Bzzt!"
			);
	}
});

const checkReservations = (channelID, nameofgroup) => {
	jakbot.on('ready', (jakbot) => {
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
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				const today = new Date();
				jakbot.channels.cache
					.get(channelID)
					.send('\0 \n Date Today: ' + today.toISOString().substring(0, 10));
				// get date from last reservation
				const lastReservation = data.reservations[data.reservations.length - 1];
				const lastReservationDate = new Date(lastReservation.startDate);
				// days until last reservation
				const daysUntilLastReservation =
					(lastReservationDate - today) / 1000 / 60 / 60 / 24;
				// mathfloor to get the whole number
				const daysUntilLastReservationRounded = Math.floor(
					daysUntilLastReservation
				);
				let totalHoursLeft = 0; // declare a variable to keep track of total hours left

				for (let i = 0; i < data.reservations.length; i++) {
					const dateStr = data.reservations[i].startDate;
					const date = new Date(dateStr);

					// check if the reservation is between today and five days from now
					const fiveDaysFromNow = new Date(
						today.getTime() + 5 * 24 * 60 * 60 * 1000
					);
					const isBetweenTodayAndFiveDaysFromNow =
						date >= today && date <= fiveDaysFromNow;
					// const from date > today && date <  end of the year
					const betweenNowAndInfinite = date >= today;

					if (betweenNowAndInfinite) {
						const endDate1 = data.reservations[i].endDate;
						const endTime1 = endDate1.substring(11, 16);
						const time1 = dateStr.substring(11, 16);
						const date1 = dateStr.substring(0, 10);
						const startDateTime1 = new Date(dateStr);
						const endDateTime1 = new Date(endDate1);
						const hoursDiff = (endDateTime1 - startDateTime1) / 3600000;
						// add up the hours for the current reservation
						totalHoursLeft += hoursDiff;
					}

					// loop if StartDate is today for reservation or tomorrow for reservation
					if (isBetweenTodayAndFiveDaysFromNow) {
						const endDate = data.reservations[i].endDate;
						const endTime = endDate.substring(11, 16);
						const time = dateStr.substring(11, 16);
						const date = dateStr.substring(0, 10);
						const startDateTime = new Date(dateStr);
						const endDateTime = new Date(endDate);
						const hoursDiff = (endDateTime - startDateTime) / 3600000;
						const subjectsCount = data.reservations.length; // Get the total count of subjects in the response
						const currentSubjectIndex = i; // Get the index of the current subject in the response
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

						// if (room) {
						//   const roomName = room.code;
						//   jakbot.channels.cache.get(channelID).send(` -- \n Room: ${roomName}`);
						// } else {
						//   jakbot.channels.cache.get(channelID).send('-- \n Remote teaching.');
						// }
					}
				}
				jakbot.channels.cache
					.get(channelID)
					.send(
						`\0 \n Total curriculum hours left: ${totalHoursLeft} \n Total actual days left:  ${daysUntilLastReservationRounded}`
					); // log or send a message with the total hours left

				if (data.reservations.length === 0) {
					jakbot.channels.cache
						.get(channelID)
						.send(
							"\0 \n Looks like a black hole just appeared and swallowed all the reservations in the future.Guess it's time to break out the popcorn and watch time unravel from the comfort of your couch!"
						);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});
};

checkReservations(channelID, 'tvt21-m');
checkReservations(logs, 'tvt21-m');
