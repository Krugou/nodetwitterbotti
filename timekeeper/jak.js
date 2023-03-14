import 'discord-reply';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelID = '1084944685568638976';

jakbot.login(process.env.DISCORD_TOKEN);
jakbot.once(Events.ClientReady, c => {
    // console.log(`Ready! Logged in as ${c.user.tag}`);

});
jakbot.on('ready', jakbot => {

    jakbot.user.setUsername('TimeKeeper');
    jakbot.user.setActivity('Nodejs', { type: 'PLAYING' });
    // if today is monday
    const today = new Date();
    const day = today.getDay();
    if (day === 1) {
        jakbot.channels.cache.get(channelID).
            send('Hello, I am the TimeKeeper, I will keep track of current time and remind you when we have a classes coming up! have a nice week!');
    }
});

const checkReservations = () => {
    jakbot.on('ready', jakbot => {


        fetch('https://opendata.metropolia.fi/r1/reservation/search', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(process.env.APIKEYMETROPOLIA),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "studentGroup": ["tvt21-m"]
            })
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                for (let i = 0; i < data.reservations.length; i++) {
                    const dateStr = data.reservations[i].startDate;
                    const date = new Date(dateStr);

                    // check if the reservation is between today and five days from now
                    const today = new Date();
                    const fiveDaysFromNow = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
                    const isBetweenTodayAndFiveDaysFromNow = date >= today && date <= fiveDaysFromNow;

                    // loop if StartDate is today for reservation or tomorrow for reservation
                    if (isBetweenTodayAndFiveDaysFromNow) {
                        const endDate = data.reservations[i].endDate;
                        const endTime = endDate.substring(11, 16);
                        // get time from startDate
                        const time = dateStr.substring(11, 16);
                        // get time from endDate
                        // get date from startDate
                        const date = dateStr.substring(0, 10);
                        jakbot.channels.cache.get(channelID).send(date + ' Aiheena on: ' + data.reservations[i].subject + ' aika välillä: ' + time + ' - ' + endTime);

                        // if reservations has more than 2 resources
                        if (data.reservations[i].resources.length > 2) {
                            jakbot.channels.cache.get(channelID).send(' joka on luokassa: ' + data.reservations[i].resources[2].code);

                        } else {
                            jakbot.channels.cache.get(channelID).send('Luultavasti on etäopetusta tai ei ole luokkaa');
                        }
                    }
                }


            }
            )
            .catch(err => {
                console.log(err);
            });


    });
};

checkReservations();





