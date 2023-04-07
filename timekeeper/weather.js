import 'discord-reply';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fetch from 'node-fetch';
import { DOMParser } from 'xmldom';
const jakbot = new Client({ intents: [GatewayIntentBits.Guilds] });
const channelIDKaramalmi = '1088834352303067256';
const channelIDKaramalmilogs = '1088834182018519170';

jakbot.login(process.env.DISCORD_TOKEN);
jakbot.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


jakbot.on('ready', jakbot => {
    const channel = jakbot.channels.cache.get(channelIDKaramalmi);
    channel.messages.fetch({ limit: 100 })
        .then(messages => {
            // Delete the messages
            channel.bulkDelete(messages);
        })
        .catch(console.error);
    jakbot.user.setUsername('WeatherMan');
    jakbot.user.setActivity('Nodejs', { type: 'PLAYING' });
    // if today is monday
    const today = new Date();
    const day = today.getDay();
    if (day === 1) {
        jakbot.channels.cache.get(channelIDKaramalmi).
            send(" \0 \n Hello, I am the WeatherMan! I'm here to give you the forecast for the only weather that matters - the weather in your school area! Whether it's raining cats and dogs, or so hot you could fry an egg on the sidewalk, I'll keep you informed.And don't worry, I'll throw in some puns to lighten the mood, like 'Looks like we're in for a real 'rain-deer' situation today!' or 'It's so hot, even the sun is sweating!' So, let's make this week weather-tastic! Have an umbrella, just in case!");
    }
});

const checkWeather = (lat, lon, hoursfromnow, CHANNELID) => {
    let weatherData = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::simple&latlon=' + lat + ',' + lon + '&parameters=temperature,windSpeedMS,WeatherSymbol3';
    jakbot.on('ready', jakbot => {
        fetch(weatherData)
            .then(response => {
                return response.text();
            })
            .then(xml => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, 'application/xml');
                jakbot.channels.cache.get(CHANNELID).send(' karamalmin säätiedotus: ');
                const elements = doc.getElementsByTagName('BsWfs:BsWfsElement');
                for (let i = 0; i < elements.length; i++) {
                    const paramName = elements[i].getElementsByTagName('BsWfs:ParameterName')[0].textContent;
                    if (paramName === 'WeatherSymbol3' && i === (hoursfromnow * 3) - 1) {
                        let paramValue = elements[i].getElementsByTagName('BsWfs:ParameterValue')[0].textContent;
                        paramValue = Number(paramValue);
                        paramValue = Math.round(paramValue);
                        let weather = '';
                        if (paramValue === 1) {
                            weather = 'Selkeää';
                        } else if (paramValue === 2) {
                            weather = 'Puolipilvistä';
                        } else if (paramValue === 21) {
                            weather = 'Heikkoja sadekuuroja';
                        } else if (paramValue === 22) {
                            weather = 'Sadekuuroja';
                        } else if (paramValue === 23) {
                            weather = 'Voimakkaita sadekuuroja';
                        } else if (paramValue === 3) {
                            weather = 'Pilvistä';
                        } else if (paramValue === 31) {
                            weather = 'Heikkoa vesisadetta';
                        } else if (paramValue === 32) {
                            weather = 'Vesisadetta';
                        } else if (paramValue === 33) {
                            weather = 'Voimakasta vesisadetta';
                        } else if (paramValue === 41) {
                            weather = 'Heikkoja lumikuuroja';
                        } else if (paramValue === 42) {
                            weather = 'Lumikuuroja';
                        } else if (paramValue === 43) {
                            weather = 'Voimakkaita lumikuuroja';
                        } else if (paramValue === 51) {
                            weather = 'Heikkoa lumisadetta';
                        } else if (paramValue === 52) {
                            weather = 'Lumisadetta';
                        } else if (paramValue === 53) {
                            weather = 'Voimakasta lumisadetta';
                        } else if (paramValue === 61) {
                            weather = 'Ukkoskuuroja';
                        } else if (paramValue === 62) {
                            weather = 'Voimakkaita ukkoskuuroja';
                        } else if (paramValue === 63) {
                            weather = 'Ukkosta';
                        } else if (paramValue === 64) {
                            weather = 'Voimakasta ukkosta';
                        } else if (paramValue === 71) {
                            weather = 'Heikkoja räntäkuuroja';
                        } else if (paramValue === 72) {
                            weather = 'Räntäkuuroja';
                        } else if (paramValue === 73) {
                            weather = 'Voimakkaita räntäkuuroja';
                        } else if (paramValue === 81) {
                            weather = 'Heikkoa räntäsadetta';
                        } else if (paramValue === 82) {
                            weather = 'Räntäsadetta';
                        } else if (paramValue === 83) {
                            weather = 'Voimakasta räntäsadetta';
                        } else if (paramValue === 91) {
                            weather = 'Utua';
                        } else if (paramValue === 92) {
                            weather = 'Sumua';
                        } else {
                            weather = 'tuntematon';
                        }
                        jakbot.channels.cache.get(CHANNELID).send('' + weather);
                    }
                    if (paramName === 'temperature' && i === (hoursfromnow * 3) - 3) {
                        const paramValue = elements[i].getElementsByTagName('BsWfs:ParameterValue')[0].textContent;

                        jakbot.channels.cache.get(CHANNELID).send('' + paramValue + ' °C');
                    }
                    if (paramName === 'windSpeedMS' && i === (hoursfromnow * 3) - 2) {
                        const paramValue = elements[i].getElementsByTagName('BsWfs:ParameterValue')[0].textContent;

                        jakbot.channels.cache.get(CHANNELID).send('tuuli ' + paramValue + ' metriä sekunnissa');
                    }

                }

            }
            );
    });
};

checkWeather(60.22400971717999, 24.758507994251243, 1, channelIDKaramalmi);
checkWeather(60.22400971717999, 24.758507994251243, 1, channelIDKaramalmilogs);





