import { load as loadDOM, CheerioAPI } from "cheerio";
import { weatherTranslation as translate } from "./weather-translation";

const getWeatherCurrent = ($: CheerioAPI) => {
  const $current = $('div[data-testid="CurrentConditionsContainer"]');
  return {
    timestamp: $current
      .find('span[class*="CurrentConditions--timestamp"]')
      .text()
      .trim(),
    tempValue: Number(
      $current
        .find('span[class*="CurrentConditions--tempValue"]')
        .text()
        .replace("°", "")
        .trim()
    ),
    secondary: {
      skyCode: Number(
        $current
          .find('div[class*="CurrentConditions--secondary"] svg[set="weather"]')
          .attr("skycode")
      ),
      phraseValue: translate({
        weather: $current
          .find(
            'div[class*="CurrentConditions--secondary"] svg[set="weather"] title'
          )
          .html(),
      }),
    },
    phraseValue: translate({
      weather: $current
        .find('div[class*="CurrentConditions--phraseValue"]')
        .text(),
    }),
  };
};

const getPrecipIntensity = ($: CheerioAPI) => {
  const $section = $('section[class*="PrecipIntensityCard"]');
  return $section.length
    ? {
        headline: $section.find('h2[class*="headline"]').text(),
        text: $section.find('p[class*="text"]').text(),
      }
    : undefined;
};

const getWeatherTable = ($: CheerioAPI, sectionSelector: string) => {
  return $(sectionSelector)
    .find('ul[data-testid="WeatherTable"] li')
    .map((_, li) => {
      $(li)
        .find('div[data-testid="SegmentPrecipPercentage"] span span')
        .remove();

      const highTempElement = $(li).find(
        'div[data-testid="SegmentHighTemp"] span'
      );

      const lowTempElement = $(li).find(
        'div[data-testid="SegmentLowTemp"] span'
      );

      return {
        day: $(li).find('h3[class*="Column--label"] span').text(),
        isActive: $(li).is('[class*="Column--active"]'),
        highTempValue: lowTempElement.length
          ? Number(highTempElement.text().replace("°", "").trim())
          : undefined,
        lowTempValue: lowTempElement.length
          ? Number(lowTempElement.text().replace("°", "").trim())
          : undefined,
        tempValue:
          lowTempElement.length === 0
            ? Number(highTempElement.text().replace("°", "").trim())
            : undefined,
        precipText: translate({
          weather: $(li)
            .find('div[data-testid="SegmentPrecipPercentage"] svg title')
            .html(),
          isPrecip: true,
        }),
        precipPercentage: Number(
          $(li)
            .find('div[data-testid="SegmentPrecipPercentage"] span')
            .text()
            .replace("%", "")
            .trim()
        ),
        skyCode: Number($(li).find('svg[set="weather"]').attr("skycode")),
        phraseValue: translate({
          weather: $(li).find('svg[set="weather"] title').html(),
        }),
      };
    })
    .get();
};

const getForecastToday = ($: CheerioAPI) => {
  return getWeatherTable($, 'section[data-testid="TodayWeatherModule"]');
};

const getWeatherFiveDays = ($: CheerioAPI) => {
  return getWeatherTable($, 'section[data-testid="DailyWeatherModule"]');
};

export const getWeatherData = async () => {
  const url =
    "https://weather.com/tr-TR/weather/today/l/c027c79a77e75cf682f052d9717291cc7ec6f677db4429eed536b950608f171d?unit=m";
  const response = await fetch(url);
  const html = await response.text();
  const $ = loadDOM(html);

  const degreesUnit = $(
    'ul[data-testid="unitSelectorBar"] [aria-selected="true"]'
  )
    .text()
    .replace("°", "")
    .trim();

  const location = $('h1[class*="CurrentConditions--location"]').text();

  const current = getWeatherCurrent($);
  const precipIntensity = getPrecipIntensity($);
  const today = getForecastToday($);
  const days = getWeatherFiveDays($);

  const activeIndex = today.findIndex((data) => data.isActive);
  const later = today.length > activeIndex ? today[activeIndex + 1] : undefined;

  const summary = [
    `Umuttepe'de hava şu an ${current.secondary.phraseValue?.toLowerCase()}, sıcaklık yaklaşık ${
      current.tempValue
    }°C.`,
    precipIntensity?.text,
    later
      ? `${
          later.day
        } hava ${later.phraseValue?.toLowerCase()}, tahmini sıcaklık ${
          later.tempValue
        }°C.`
      : undefined,
  ]
    .join(" ")
    .trim();

  return {
    degreesUnit,
    location,
    current,
    precipIntensity,
    today,
    days,
    summary,
  };
};

export type WeatherAPIResponse = Awaited<ReturnType<typeof getWeatherData>>;
