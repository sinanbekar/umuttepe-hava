const TRANSLATION = {
  Orta: "Açık", // looks like only it's the translated one (but non-native)
  Fair: "Açık",
  Clear: "Açık",
  "Clear Night": "Açık",
  Sunny: "Güneşli",
  "Mostly Sunny": "Çoğunlukla Güneşli",
  Cloudy: "Bulutlu",
  "Mostly Cloudy": "Çoğunlukla Bulutlu",
  "Mostly Cloudy Night": "Çoğunlukla Bulutlu",
  "Mostly Clear": "Az Bulutlu",
  "Mostly Clear Night": "Az Bulutlu",
  "Partly Cloudy": "Parçalı Bulutlu",
  "Partly Cloudy Night": "Parçalı Bulutlu",
  Foggy: "Sisli",
  Rain_PRECIP: "Yağmur",
  Rain: "Yağmurlu",
  Rainy: "Yağmurlu",
  "Scattered Showers": "Sağanak Yağışlı",
  Snow: "Kar",
  Snow_PRECIP: "Kar",
  Snowy: "Karlı",
  // TODO: add more
};

// https://www.mgm.gov.tr/genel/meteorolojisozlugu.aspx

// https://github.com/adityaagn/FP-Rekayasa-Kebutuhan-/blob/master/RKV2/assets/global/js/widgets/widget_weather.js

// https://github.com/search?q=SegmentPrecipPercentage&type=code
// https://github.com/GrussO17/Weather/blob/5450813b2ac0bc81ca5105f506ff0a1493441842/weatherv2.py
// https://github.com/AliSawari/serendip-weather/blob/b34a92d5f20e34ccf25d4dd84db5cddf087f9145/README.md

// https://stackoverflow.com/questions/12142094/msn-weather-api-list-of-conditions

// skycode - skytext
// 0, 1 ,2, 3 ,4, 17, 35 - Thunderstorm
// 5 - Rain/Snow mix
// 6 - Sleet/Snow mix
// 7 - Rain/Snow/Sleet mix
// 8,9 - Icy
// 10 - Rain/Sleet mix
// 11 - Light Rain
// 12 - Rain
// 13 - Light Snow
// 14,16,42,43 - Snow
// 15 - Blizzard
// 18,40 - Showers
// 19 - Dust
// 20 - Fog
// 21 - Haze
// 22 - Smoke
// 23,24 - Windy
// 25 - Frigid
// 26 - Cloudy
// 27,29,33 - Partly Cloudy (night)
// 28,30,34 - Partly Cloudy
// 31 - Clear (night)
// 32 - Clear
// 36 - Hot
// 37,38 - Scattered Thunderstorms
// 39 - Scattered Showers
// 41 - Scattered Snow Showers
// 44 - N/A
// 45 - Scattered Rain Showers (night)
// 46 - Scattered Snow Showers (night)
// 47 - Scattered Thunderstorms (night)

type Props = {
  weather: string | null;
  isPrecip?: boolean;
};

export const weatherTranslation = ({ weather, isPrecip = false }: Props) => {
  if (!weather) return null;

  const map = new Map(Object.entries(TRANSLATION));
  const key = `${weather}${isPrecip ? "_PRECIP" : ""}`;

  return map.get(key) ?? weather;
};
