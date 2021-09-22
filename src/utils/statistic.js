import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const durationWatchedMovies = (minutes) =>  {
  const totalHours = Math.floor(minutes / 60);
  const totalMinuts = minutes - (totalHours * 60);
  return [totalHours, totalMinuts];
};

export const getGenreStat = (movies) => {
  const genreArray = movies.map((movie) => movie.genres);
  const genres = [];
  genreArray.forEach((movie) => {
    movie.forEach((genre)=>{
      genres.push(genre);
    })
  });

  const genreStats = new Object();
  genres.forEach((genre) => {
    const value = movies.filter((movie) => movie.genres.includes(genre));
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
