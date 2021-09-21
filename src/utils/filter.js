import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import {FilterType, FilterStatisticType} from '../const';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const filter = {
  [FilterType.ALL]: (movies) => movies.filter((movie) => movie),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.user_details.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.user_details.already_watched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.user_details.favorite),
};

const daysToToday = 0;
const daysToFullWeek = 6;
const monthsToDate = 1;
const yearsToDate = 1;

const isIncluded = (movie, from, type) => {
  const dateTo = dayjs().toDate();
  const dateFrom = dayjs().subtract(from, type).toDate();
  if (
    dayjs(movie.user_details.watching_date).isSame(dateFrom) ||
    dayjs(movie.user_details.watching_date).isBetween(dateFrom, dateTo) ||
    dayjs(movie.user_details.watching_date).isSame(dateTo)
  ){
    return movie;
  }
};

export const filterStatistic = {
  [FilterStatisticType.ALL_TIME]: (movies) => movies.filter((movie) => movie),
  [FilterStatisticType.TODAY]: (movies) => movies.filter((movie) => isIncluded(movie, daysToToday, 'day')),
  [FilterStatisticType.WEEK]: (movies) => movies.filter((movie) => isIncluded(movie, daysToFullWeek, 'day')),
  [FilterStatisticType.MONTH]: (movies) => movies.filter((movie) => isIncluded(movie, monthsToDate, 'month')),
  [FilterStatisticType.YEAR]: (movies) => movies.filter((movie) => isIncluded(movie, yearsToDate, 'year')),
};
