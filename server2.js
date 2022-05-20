import 'dotenv/config';
import {TwitterApi} from 'twitter-api-v2';
import fetch from 'node-fetch';

let data = 'https://users.metropolia.fi/~aleksino/mediaprojekti/json/beaches.json';
let nimipaivat = 'https://users.metropolia.fi/~aleksino/nimipaivat2.json';
// .env tiedostosta haetaan avaimet twitteriin
const userClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const userClient2 = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY2,
  appSecret: process.env.TWITTER_API_SECRET2,
  accessToken: process.env.TWITTER_ACCESS_TOKEN2,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET2,
});
// tweettaus Funktio

const tweet2 = async () => {
  const response = await fetch(nimipaivat);
  const response2 = await fetch(data);
  const jsonData = await response.json();
  const fetchDataJson = await response2.json();
  let today = new Date();
  let currentDayMonth = today.getDate() + '.' + (today.getMonth() + 1);
  // console.log(currentDayMonth)
  let temperatureData = [];
  let placeNameData = [];
  let airTemperatureData = [];
  let timeTakenData = [];
  let currentDate = new Date();
  // console.log(currentDate.getTime());
  // säädatan haku
  /*  for (let i = 0; i < fetchDataJson.beaches.length; i++) {
     const response = await fetch("https://iot.fvh.fi/opendata/uiras/"+fetchDataJson.beaches[i].url+".json");
     const fetchDataJson2 = await response.json();
     const laskejsondata = fetchDataJson2.data.length - 1;
     const jsonaika = new Date(fetchDataJson2.data[laskejsondata].time)
     if ( jsonaika.getTime() > (currentDate.getTime() - 7200000) && jsonaika.getTime() < currentDate.getTime() ) {
       console.log("lämpötila haku Kierros vielä!!!")
     let paikannimi = fetchDataJson2.meta.name;
     let aikajsondata = fetchDataJson2.data[laskejsondata].time;
     let waterTemperaturedata = fetchDataJson2.data[laskejsondata].temp_water;
     let airTemperaturedata = fetchDataJson2.data[laskejsondata].temp_air;
     temperatureData.push(waterTemperaturedata);
     placeNameData.push(paikannimi);
     airTemperatureData.push(airTemperaturedata);
     timeTakenData.push(aikajsondata);
   } else {
     continue;

   }
   }
   const max = Math.max(...temperatureData);
   const index = temperatureData.indexOf(max);
   let placeName = placeNameData[index];
   let waterTemperature = temperatureData[index];
   let airTemperature = airTemperatureData[index];
   let timeTaken = new Date(timeTakenData[index]);
   //tweetataan
   try {
    await + userClient.v2.tweet(
        'Kuumin uimaveden lämpötila on paikassa: ' + placeName + ' asteita on ' +
         waterTemperature + ' \xB0C  ja ' + 'Ilman lämpötila on ' + airTemperature +
         ' \xB0C ' + 'kello: ' + timeTaken.toLocaleTimeString('fi-FI'));
   } catch (e) {
     console.error(e);
   } */
  for (let i = 0; i < jsonData.suominimipaivat.length; i++) {
    if (currentDayMonth === jsonData.suominimipaivat[i].date) {
      // console.log(jsonData.suominimipaivat[i].name)
      //tweetataan 2
      try {
        await userClient2.v2.tweet(
            ' Nimipäivää juhlii ' + today.toLocaleDateString() + ': ' +
            jsonData.suominimipaivat[i].name);
      } catch (e) {
        console.error(e);
      }
    }
  }
};

const mainProgram = () => {
  tweet2();
  console.log('mainProgram Kierros vielä!!!');
};
mainProgram();
// tweettauksen yritys joka 15min koska data muuttuu vaan 30min välein botti onnistuu tweettauksessa vaan 30min välein
setInterval(mainProgram, 46800000);