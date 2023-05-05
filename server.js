import 'dotenv/config';
import fetch from 'node-fetch';
import {TwitterApi} from 'twitter-api-v2';

const data = 'https://krugou.github.io/nonprojectfiles/beaches.json';
const userClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const fetchData = async () => {
  const response = await fetch(data);
  const fetchDataJson = await response.json();
  let temperatureData = [];
  let currentDate = new Date();

  for (const beach of fetchDataJson.beaches) {
    const response = await fetch(`https://iot.fvh.fi/opendata/uiras/${beach.url}.json`);
    const fetchDataJson2 = await response.json();
    const latestData = fetchDataJson2.data[fetchDataJson2.data.length - 1];
    const dataDate = new Date(latestData.time);

    if (dataDate.getTime() > currentDate.getTime() - 7200000 && dataDate.getTime() < currentDate.getTime()) {
      temperatureData.push({
        placeName: fetchDataJson2.meta.name,
        time: latestData.time,
        waterTemperature: latestData.temp_water,
        airTemperature: latestData.temp_air,
      });
    }
  }

  return temperatureData;
};

const tweetInfo = (placeName, waterTemperature, airTemperature, time) => {
  const timeTaken = new Date(time);
  return `Kello: ${timeTaken.toLocaleTimeString('fi-FI')} Uimaveden lämpötila on paikassa: #${placeName} asteita on ${waterTemperature} \xB0C  ja Ilman lämpötila on ${airTemperature} \xB0C #pääkaupunkiseutu`;
};

const tweetTemperature = async (tweetText) => {
  try {
    await userClient.v2.tweet(tweetText);
  } catch (e) {
    console.error(e);
  }
};

const main = async () => {
  const temperatureData = await fetchData();
  temperatureData.sort((a, b) => b.waterTemperature - a.waterTemperature);

  const highestTemperature = temperatureData[0];
  const secondHighestTemperature = temperatureData[1];

  const highestTweetText = tweetInfo(
    highestTemperature.placeName,
    highestTemperature.waterTemperature,
    highestTemperature.airTemperature,
    highestTemperature.time
  );

  const secondHighestTweetText = tweetInfo(
    secondHighestTemperature.placeName,
    secondHighestTemperature.waterTemperature,
    secondHighestTemperature.airTemperature,
    secondHighestTemperature.time
  );

  await tweetTemperature(highestTweetText);
  await tweetTemperature(secondHighestTweetText);
};

setInterval(main, 2100000);
