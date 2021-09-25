import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const getGenreStat = (movies) => {
  const genreArray = movies.map((movie) => movie.genres);
  const genres = [];
  genreArray.forEach((movie) => {
    movie.forEach((genre)=>{
      genres.push(genre);
    });
  });

  const genreStats = {};
  genres.forEach((genre) => {
    const value = movies.filter((movie) => movie.genres.includes(genre));
    const genreItem = { [genre] : value.length};
    Object.assign(genreStats, genreItem);
  });
  return genreStats;
};

export const getFavoriteGenre = (genreStatistic) => {
  let favoriteGenre;
  for (const key in genreStatistic) {
    if (!favoriteGenre || genreStatistic[key] > favoriteGenre) {
      favoriteGenre = key;
    }
  }
  return favoriteGenre;
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
  ) {
    return movie;
  }
};

export const filterStatistics = {
  ['statistic-all-time']: (movies) => movies.filter((movie) => movie),
  ['statistic-today']: (movies) => movies.filter((movie) => isIncluded(movie, daysToToday, 'day')),
  ['statistic-week']: (movies) => movies.filter((movie) => isIncluded(movie, daysToFullWeek, 'day')),
  ['statistic-month']: (movies) => movies.filter((movie) => isIncluded(movie, monthsToDate, 'month')),
  ['statistic-year']: (movies) => movies.filter((movie) => isIncluded(movie, yearsToDate, 'year')),
};
