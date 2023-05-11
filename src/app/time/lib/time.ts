/* eslint-disable-next-line import/no-duplicates */
import { formatDistanceToNowStrict } from "date-fns";
/* eslint-disable-next-line import/no-duplicates */
import locale from "date-fns/locale/en-US";

export function formatDistanceShort(date: number | Date) {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

const formatDistanceLocale = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}mo",
  xMonths: "{{count}}mo",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistance(
  token: keyof typeof formatDistanceLocale,
  count: number
) {
  return formatDistanceLocale[token].replace("{{count}}", count.toString());
}
