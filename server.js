import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";
import fetch from "node-fetch";

let data = "https://krugou.github.io/nonprojectfiles/beaches.json";
const userClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const tweet = async () => {
  const response = await fetch(data);
  const fetchDataJson = await response.json();
  let temperatureData = [];
  let placeNameData = [];
  let airTemperatureData = [];
  let timeTakenData = [];
  let currentDate = new Date();
  for (let i = 0; i < fetchDataJson.beaches.length; i++) {
    const response = await fetch(
      "https://iot.fvh.fi/opendata/uiras/" +
      fetchDataJson.beaches[i].url +
      ".json"
    );
    const fetchDataJson2 = await response.json();
    const dataIndexNumber = fetchDataJson2.data.length - 1;
    const dateDataJson = new Date(fetchDataJson2.data[dataIndexNumber].time);

    if (
      dateDataJson.getTime() > currentDate.getTime() - 7200000 &&
      dateDataJson.getTime() < currentDate.getTime()
    ) {
      let paikannimi = fetchDataJson2.meta.name;
      let aikajsondata = fetchDataJson2.data[dataIndexNumber].time;
      let waterTemperaturedata =
        fetchDataJson2.data[dataIndexNumber].temp_water;
      let airTemperaturedata = fetchDataJson2.data[dataIndexNumber].temp_air;
      temperatureData.push(waterTemperaturedata);
      placeNameData.push(paikannimi);
      airTemperatureData.push(airTemperaturedata);
      timeTakenData.push(aikajsondata);
    } else {
      continue;
    }
  }
  let biggest = temperatureData[0];
  let nextbiggest = temperatureData[0];
  for (let i = 0; i < temperatureData.length; i++) {
    if (temperatureData[i] > biggest) {
      nextbiggest = biggest;
      biggest = temperatureData[i];
    } else if (
      temperatureData[i] > nextbiggest &&
      temperatureData[i] != biggest
    )
      nextbiggest = temperatureData[i];
  }
  const max = Math.max(...temperatureData);
  const index = temperatureData.indexOf(max);
  const index2 = temperatureData.indexOf(nextbiggest);
  let placeName2 = placeNameData[index2];
  let waterTemperature2 = temperatureData[index2];
  let airTemperature2 = airTemperatureData[index2];
  let timeTaken2 = new Date(timeTakenData[index2]);
  let tweetinglist2 =
    "Kello: " +
    timeTaken2.toLocaleTimeString("fi-FI") +
    " Toiseksi korkein uimaveden lämpötila on paikassa: #" +
    placeName2 +
    " asteita on " +
    waterTemperature2 +
    " \xB0C  ja " +
    "Ilman lämpötila on " +
    airTemperature2 +
    " \xB0C #pääkaupunkiseutu";

  try {
    userClient.v2.tweet(tweetinglist2);
  } catch (e) {
    console.error(e);
  }
};
const tweet2 = async () => {
  const response = await fetch(data);
  const fetchDataJson = await response.json();
  let temperatureData = [];
  let placeNameData = [];
  let airTemperatureData = [];
  let timeTakenData = [];
  let currentDate = new Date();
  for (let i = 0; i < fetchDataJson.beaches.length; i++) {
    const response = await fetch(
      "https://iot.fvh.fi/opendata/uiras/" +
      fetchDataJson.beaches[i].url +
      ".json"
    );
    const fetchDataJson2 = await response.json();
    const dataIndexNumber = fetchDataJson2.data.length - 1;
    const dateDataJson = new Date(fetchDataJson2.data[dataIndexNumber].time);
    if (
      dateDataJson.getTime() > currentDate.getTime() - 7200000 &&
      dateDataJson.getTime() < currentDate.getTime()
    ) {
      let paikannimi = fetchDataJson2.meta.name;
      let aikajsondata = fetchDataJson2.data[dataIndexNumber].time;
      let waterTemperaturedata =
        fetchDataJson2.data[dataIndexNumber].temp_water;
      let airTemperaturedata = fetchDataJson2.data[dataIndexNumber].temp_air;

      temperatureData.push(waterTemperaturedata);
      placeNameData.push(paikannimi);
      airTemperatureData.push(airTemperaturedata);
      timeTakenData.push(aikajsondata);


    } else {
      continue;
    }
  }
  let biggest = temperatureData[0];
  let nextbiggest = temperatureData[0];
  for (let i = 0; i < temperatureData.length; i++) {
    if (temperatureData[i] > biggest) {
      nextbiggest = biggest;
      biggest = temperatureData[i];
    } else if (
      temperatureData[i] > nextbiggest &&
      temperatureData[i] != biggest
    )
      nextbiggest = temperatureData[i];
  }

  const max = Math.max(...temperatureData);
  const index = temperatureData.indexOf(max);
  const index2 = temperatureData.indexOf(nextbiggest);

  let placeName = placeNameData[index];
  let waterTemperature = temperatureData[index];
  let airTemperature = airTemperatureData[index];
  let timeTaken = new Date(timeTakenData[index]);


  let tweetinglist =
    "Kello: " +
    timeTaken.toLocaleTimeString("fi-FI") +
    " Korkein uimaveden lämpötila on paikassa: #" +
    placeName +
    " asteita on " +
    waterTemperature +
    " \xB0C  ja " +
    "Ilman lämpötila on " +
    airTemperature +
    " \xB0C #pääkaupunkiseutu";

  try {
    userClient.v2.tweet(tweetinglist);
  } catch (e) {
    console.error(e);
  }
};
setInterval(tweet, 2100000);
setInterval(tweet2, 2700000);
