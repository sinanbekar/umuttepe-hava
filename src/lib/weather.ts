import { load as loadDOM, CheerioAPI, Cheerio, AnyNode } from "cheerio";
import { weatherTranslation as translate } from "./weather-translation";

let $!: CheerioAPI;

const toNumber = (num?: string | null) => (num ? Number(num) || null : null);

const findText = (
  $base: Cheerio<AnyNode>,
  selector: string,
  canBeNull = false
) => {
  const text = $base.find(selector).text().trim() || null;

  if (!canBeNull && text === null) {
    // "mostly" something went wrong with parsing
    console.warn(
      "canBeNull is false, but null returned from data provider",
      `selector: ${selector}`
    );
  }

  return text;
};

const findAndReplaceText = (
  $base: Cheerio<AnyNode>,
  selector: string,
  { search = "", replace = "" },
  canBeNull = false
) =>
  findText($base, selector, canBeNull)?.replace(search, replace).trim() || null;

const getWeatherCurrent = () => {
  const $current = $('div[data-testid="CurrentConditionsContainer"]');
  return {
    timestamp: findText(
      $current,
      'span[class*="CurrentConditions--timestamp"]'
    ),
    tempValue: toNumber(
      findAndReplaceText(
        $current,
        'span[class*="CurrentConditions--tempValue"]',
        { search: "°", replace: "" }
      )
    ),
    secondary: {
      skyCode: toNumber(
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
      weather: findText(
        $current,
        'div[class*="CurrentConditions--phraseValue"]'
      ),
    }),
  };
};

const getPrecipIntensity = () => {
  const $section = $('section[class*="PrecipIntensityCard"]');
  // sometimes precipIntensity not available because of the data provider
  return {
    headline: findText($section, 'h2[class*="headline"]', true),
    text: findText($section, 'p[class*="text"]', true),
  };
};

const getWeatherTable = (sectionSelector: string) => {
  return $(sectionSelector)
    .find('ul[data-testid="WeatherTable"] li')
    .map((_, li) => {
      $(li)
        .find('div[data-testid="SegmentPrecipPercentage"] span span')
        .remove();

      return {
        day: findText($(li), 'h3[class*="Column--label"] span'),
        isActive: $(li).is('[class*="Column--active"]'),
        highTempValue: toNumber(
          findAndReplaceText($(li), 'div[data-testid="SegmentHighTemp"] span', {
            search: "°",
            replace: "",
          })
        ),
        lowTempValue: toNumber(
          findAndReplaceText(
            $(li),
            'div[data-testid="SegmentLowTemp"] span',
            {
              search: "°",
              replace: "",
            },
            true
          )
        ),
        precipText: translate({
          weather: $(li)
            .find('div[data-testid="SegmentPrecipPercentage"] svg title')
            .html(),
          isPrecip: true,
        }),
        precipPercentage: toNumber(
          findAndReplaceText(
            $(li),
            'div[data-testid="SegmentPrecipPercentage"] span',
            { search: "%", replace: "" },
            true
          )
        ),
        skyCode: toNumber($(li).find('svg[set="weather"]').attr("skycode")),
        phraseValue: translate({
          weather: $(li).find('svg[set="weather"] title').html(),
        }),
      };
    })
    .get();
};

const getForecastToday = () => {
  return getWeatherTable('section[data-testid="TodayWeatherModule"]');
};

const getWeatherFiveDays = () => {
  return getWeatherTable('section[data-testid="DailyWeatherModule"]');
};

export const getWeatherData = async () => {
  const url =
    "https://weather.com/tr-TR/weather/today/l/c027c79a77e75cf682f052d9717291cc7ec6f677db4429eed536b950608f171d?unit=m";
  const response = await fetch(url);
  const html = await response.text();

  $ = loadDOM(html);

  const degreesUnit = findAndReplaceText(
    $($._root),
    'ul[data-testid="unitSelectorBar"] [aria-selected="true"]',
    {
      search: "°",
      replace: "",
    }
  );

  const location = findText(
    $($._root),
    'h1[class*="CurrentConditions--location"]'
  );

  const current = getWeatherCurrent();
  const precipIntensity = getPrecipIntensity();
  const today = getForecastToday();
  const days = getWeatherFiveDays();

  const activeIndex = today.findIndex((data) => data.isActive);
  const later = today.length > activeIndex ? today[activeIndex + 1] : undefined; // if undefined, its overnight and we have no data

  const summary =
    [
      current.phraseValue && current.tempValue
        ? `Umuttepe'de hava şu an ${current.phraseValue.toLowerCase()}, sıcaklık yaklaşık ${
            current.tempValue
          }°C.`
        : undefined,
      precipIntensity.text,
      later
        ? later.day && later.phraseValue && later.highTempValue
          ? `${
              later.day
            } hava ${later.phraseValue.toLowerCase()}, tahmini sıcaklık ${
              later.highTempValue
            }°C.`
          : null // something went wrong with parsing
        : undefined,
    ]
      .join(" ")
      .trim() || null;

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
