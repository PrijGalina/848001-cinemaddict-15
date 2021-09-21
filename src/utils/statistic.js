import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
import {genreArray} from '../data';

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const durationWatchedMovies = (minutes) =>  {
  const totalHours = Math.floor(minutes / 60);
  const totalMinuts = minutes - (totalHours * 60);
  return [totalHours, totalMinuts];
};

export const getGenreStat = (movies) => {
  const genreStats = new Object();
  genreArray.forEach((genre) => {
    const value = movies.filter((movie) => movie.film_info.genre.includes(genre));
    const genreItem = { [genre] : value.length};
    Object.assign(genreStats, genreItem);
  });
  return genreStats;
};

export const getFavoriteGenre = (genreStatistic) => {
  let favoriteGenre;
  for (let key in genreStatistic) {
    if (!favoriteGenre || genreStatistic[key] > favoriteGenre) {
      favoriteGenre = key;
    }
  }
  return favoriteGenre;
};
