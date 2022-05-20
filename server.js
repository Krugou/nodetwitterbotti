import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";
import fetch from "node-fetch";

let data = "https://krugou.github.io/nonprojectfiles/beaches.json";
// .env tiedostosta haetaan avaimet twitteriin
const userClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
console.log("Initializing...");
// tweettaus Funktio
const tweet = async () => {
  console.log("Starting tweet program...");
  const response = await fetch(data);
  const fetchDataJson = await response.json();
  let temperatureData = [];
  let placeNameData = [];
  let airTemperatureData = [];
  let timeTakenData = [];
  let currentDate = new Date();
  // console.log(currentDate.getTime());
  // säädatan haku
  for (let i = 0; i < fetchDataJson.beaches.length; i++) {
    const response = await fetch(
      "https://iot.fvh.fi/opendata/uiras/" +
        fetchDataJson.beaches[i].url +
        ".json"
    );
    console.log("Fetching First data (" + i + ") ...");
    const fetchDataJson2 = await response.json();
    const laskejsondata = fetchDataJson2.data.length - 1;
    const jsonaika = new Date(fetchDataJson2.data[laskejsondata].time);
    /*console.log("jsonaika: " + jsonaika.getTime());
    console.log(
      "nykyinen aika - 7200000: " + (currentDate.getTime() - 7200000)
    );
    console.log("nykyinen aika: " + currentDate.getTime());
    */
    if (
      jsonaika.getTime() > currentDate.getTime() - 7200000 &&
      jsonaika.getTime() < currentDate.getTime()
    ) {
      let paikannimi = fetchDataJson2.meta.name;
      let aikajsondata = fetchDataJson2.data[laskejsondata].time;
      let waterTemperaturedata = fetchDataJson2.data[laskejsondata].temp_water;
      let airTemperaturedata = fetchDataJson2.data[laskejsondata].temp_air;

      temperatureData.push(waterTemperaturedata);
      placeNameData.push(paikannimi);
      airTemperatureData.push(airTemperaturedata);
      timeTakenData.push(aikajsondata);
      /* console.log(paikannimi);
      console.log(aikajsondata);
      console.log(waterTemperaturedata);
      console.log(airTemperaturedata);
      */
    } else {
      continue;
    }
  }
  console.log("Checking second highest values...");
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
  /* 
  console.log(index);
  console.log(biggest);
  console.log(nextbiggest);
  console.log(placeName);
  console.log(waterTemperature);
  console.log(airTemperature);
  console.log(timeTaken.toLocaleTimeString("fi-FI"));
  console.log(placeName2);
  console.log(waterTemperature2);
  console.log(airTemperature2);
  console.log(timeTaken2.toLocaleTimeString("fi-FI"));

  */
  console.log("Starting tweeting sequence...");
  //tweetataan
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
    " \xB0C ";

  try {
    userClient.v2.tweet(tweetinglist2);
    console.log(tweetinglist2);
  } catch (e) {
    console.error(e);
  }
  console.log("First Tweeting sequence finished.");
};
const tweet2 = async () => {
  console.log("Starting tweet program 2...");
  const response = await fetch(data);
  const fetchDataJson = await response.json();
  let temperatureData = [];
  let placeNameData = [];
  let airTemperatureData = [];
  let timeTakenData = [];
  let currentDate = new Date();
  // console.log(currentDate.getTime());
  // säädatan haku
  for (let i = 0; i < fetchDataJson.beaches.length; i++) {
    const response = await fetch(
      "https://iot.fvh.fi/opendata/uiras/" +
        fetchDataJson.beaches[i].url +
        ".json"
    );
    console.log("Fetching second dataset (" + i + ") ...");
    const fetchDataJson2 = await response.json();
    const laskejsondata = fetchDataJson2.data.length - 1;
    const jsonaika = new Date(fetchDataJson2.data[laskejsondata].time);
    /*console.log("jsonaika: " + jsonaika.getTime());
    console.log(
      "nykyinen aika - 7200000: " + (currentDate.getTime() - 7200000)
    );
    console.log("nykyinen aika: " + currentDate.getTime());
    */
    if (
      jsonaika.getTime() > currentDate.getTime() - 7200000 &&
      jsonaika.getTime() < currentDate.getTime()
    ) {
      let paikannimi = fetchDataJson2.meta.name;
      let aikajsondata = fetchDataJson2.data[laskejsondata].time;
      let waterTemperaturedata = fetchDataJson2.data[laskejsondata].temp_water;
      let airTemperaturedata = fetchDataJson2.data[laskejsondata].temp_air;

      temperatureData.push(waterTemperaturedata);
      placeNameData.push(paikannimi);
      airTemperatureData.push(airTemperaturedata);
      timeTakenData.push(aikajsondata);
      /* console.log(paikannimi);
      console.log(aikajsondata);
      console.log(waterTemperaturedata);
      console.log(airTemperaturedata);
      */
    } else {
      continue;
    }
  }
  console.log("Checking highest values...");
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
  /* 
  console.log(index);
  console.log(biggest);
  console.log(nextbiggest);
  console.log(placeName);
  console.log(waterTemperature);
  console.log(airTemperature);
  console.log(timeTaken.toLocaleTimeString("fi-FI"));
  console.log(placeName2);
  console.log(waterTemperature2);
  console.log(airTemperature2);
  console.log(timeTaken2.toLocaleTimeString("fi-FI"));

  */
  console.log("Starting second tweeting sequence...");
  //tweetataan

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
    " \xB0C ";

  try {
    userClient.v2.tweet(tweetinglist);
    console.log(tweetinglist);
  } catch (e) {
    console.error(e);
  }
  console.log("Second Tweeting sequence finished.");
  console.log("Tweet program complete reload in about 35 minutes...");
};
let tweetlog1 = () => {
  console.log("First tweet in 10 seconds.");
};
let tweetlog2 = () => {
  console.log("Second tweet in 15 seconds.");
};
// tweettauksen yritys joka 15min koska data muuttuu vaan 30min välein botti onnistuu tweettauksessa vaan 30min välein

setInterval(tweetlog1, 2100000);
setInterval(tweet, 2160000);
setInterval(tweetlog2, 2165000);
setInterval(tweet2, 2180000);
