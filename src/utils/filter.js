import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import {FilterType, filterStatsType} from '../const';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const filter = {
  [FilterType.ALL]: (movies) => movies.filter((movie) => movie),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isWatchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isHistory),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite),
};

const daysToToday = 0;
const daysToFullWeek = 6;
const monthsToDate = 1;
const yearsToDate = 1;

const isIncluded = (movie, from, type) => {
  const dateTo = dayjs().toDate();
  const dateFrom = dayjs().subtract(from, type).toDate();
  if (
    dayjs(movie.watchingDate).isSame(dateFrom) ||
    dayjs(movie.watchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(movie.watchingDate).isSame(dateTo)
  ){
    return movie;
  }
};

export const filterStats = {
  [filterStatsType.ALL_TIME]: (movies) => movies.filter((movie) => movie),
  [filterStatsType.TODAY]: (movies) => movies.filter((movie) => isIncluded(movie, daysToToday, 'day')),
  [filterStatsType.WEEK]: (movies) => movies.filter((movie) => isIncluded(movie, daysToFullWeek, 'day')),
  [filterStatsType.MONTH]: (movies) => movies.filter((movie) => isIncluded(movie, monthsToDate, 'month')),
  [filterStatsType.YEAR]: (movies) => movies.filter((movie) => isIncluded(movie, yearsToDate, 'year')),
};

export const filterStatsDuration = (movies) => movies.reduce((total, movie) => total + movie.duration, 0);
