import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (movies) => movies.filter((movie) => movie),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isWatchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isHistory),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite),
};
