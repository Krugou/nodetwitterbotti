import 'discord-reply';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';

const jakbot = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelID = '1084944685568638976';
const logs = '1087029247501152297';

jakbot.login(process.env.DISCORD_TOKEN);
jakbot.once(Events.ClientReady, c => {
  // console.log(`Ready! Logged in as ${c.user.tag}`);

});


jakbot.on('ready', jakbot => {
  const channel = jakbot.channels.cache.get(channelID);
  channel.messages.fetch({ limit: 100 })
    .then(messages => {
      // Delete the messages
      channel.bulkDelete(messages);
    })
    .catch(console.error);
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

const checkReservations = (channelID, nameofgroup) => {
  jakbot.on('ready', jakbot => {


    fetch('https://opendata.metropolia.fi/r1/reservation/search', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(process.env.APIKEYMETROPOLIA),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "studentGroup": [nameofgroup]
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const today = new Date();
        jakbot.channels.cache.get(channelID).send('Date Today: ' + today.toISOString().substring(0, 10));
        jakbot.channels.cache.get(channelID).send('------------------------------------------------------------------');

        let totalHoursLeft = 0; // declare a variable to keep track of total hours left

        for (let i = 0; i < data.reservations.length; i++) {
          const dateStr = data.reservations[i].startDate;
          const date = new Date(dateStr);

          // check if the reservation is between today and five days from now
          const fiveDaysFromNow = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
          const isBetweenTodayAndFiveDaysFromNow = date >= today && date <= fiveDaysFromNow;
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
            jakbot.channels.cache.get(channelID).send('Reservation ID: ' + data.reservations[i].id);
            jakbot.channels.cache.get(channelID).send('Date: ' + date);
            jakbot.channels.cache.get(channelID).send('Subject: ' + data.reservations[i].subject);
            jakbot.channels.cache.get(channelID).send('Start Time: ' + time);
            jakbot.channels.cache.get(channelID).send('End Time: ' + endTime);
            jakbot.channels.cache.get(channelID).send(`Count: ${currentSubjectIndex}/${subjectsCount}.`);
            jakbot.channels.cache.get(channelID).send('Left:  ' + (subjectsCount - currentSubjectIndex - 1));
            jakbot.channels.cache.get(channelID).send('Duration: ' + hoursDiff.toFixed(2) + ' hours');

            const resources = data.reservations[i].resources;
            const room = resources.find(resource => resource.type === 'room');
            if (room) {
              const roomName = room.code;
              jakbot.channels.cache.get(channelID).send(`Room: ${roomName}`);
            } else {
              jakbot.channels.cache.get(channelID).send('Remote teaching.');
            }
            jakbot.channels.cache.get(channelID).send('------------------------------------------------------------------');

          }

        }
        jakbot.channels.cache.get(channelID).send(`Total hours left: ${totalHoursLeft}`); // log or send a message with the total hours left


      }
      )
      .catch(err => {
        console.log(err);
      });


  });
};


checkReservations(channelID, "tvt21-pe");
checkReservations(logs);






