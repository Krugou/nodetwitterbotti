import 'discord-reply';
import {Client, Events, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({intents: [GatewayIntentBits.Guilds]});
const channelIDKaramalmi = '1087689568549097567';
const channelIDKaramalmilogs = '1088015207210696714';

jakbot.login(process.env.DISCORD_TOKEN);
jakbot.once(Events.ClientReady, (c) => {
	// console.log(`Ready! Logged in as ${c.user.tag}`);
});

jakbot.on('ready', (jakbot) => {
	const channel = jakbot.channels.cache.get(channelIDKaramalmi);
	channel.messages
		.fetch({limit: 100})
		.then((messages) => {
			// Delete the messages
			channel.bulkDelete(messages);
		})
		.catch(console.error);
	jakbot.user.setUsername('LunchKeeper');
	jakbot.user.setActivity('Nodejs', {type: 'PLAYING'});
	// if today is monday
	const today = new Date();
	const day = today.getDay();
	if (day === 1) {
		jakbot.channels.cache
			.get(channelIDKaramalmi)
			.send(
				" \0 \n Hello, I am the LunchKeeper! I'm here to make sure you don't go hungry while you learn. Today's menu includes culinary masterpieces such as mystery meatloaf, unidentifiable vegetable medley, and a side of tater tots.Don't worry, it's all edible...I think.Have a nice week, and may the odds be ever in your flavor!"
			);
	}
});

const checkMenu = (id, language, channelID) => {
	jakbot.on('ready', () => {
		fetch(
			'https://www.compass-group.fi/menuapi/feed/json?costNumber=' +
				id +
				'&language=' +
				language
		)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				let noLunchBoolean = false;
				// console.log(data);
				if (data.MenusForDays.length === 0) {
					noLunchBoolean = true;
				}
				if (!noLunchBoolean) {
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
					jakbot.channels.cache.get(channelID).send('Ei lounasta tänään');
				}
			});
	});
};

checkMenu(3208, 'fi', channelIDKaramalmi);
checkMenu(3208, 'fi', channelIDKaramalmilogs);
