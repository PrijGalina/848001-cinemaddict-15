

export const emojiArray = ['smile', 'sleeping', 'puke', 'angry'];

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
  BY_COMMENTS_COUNT: 'comments',
};

export const SortStatisticType = {
  ALL_TIME: 'statistic-all-time',
  TODAY: 'statistic-today',
  WEEK: 'statistic-week',
  MONTH: 'statistic-month',
  YEAR: 'statistic-year',
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const MoviesListType = {
  ALL: {
    movieCount: 5,
  },
  COMMENTED: {
    movieCount: 2,
  },
  RATED: {
    movieCount: 2,
  },
};

export const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_MOVIE_DATA: 'UPDATE_MOVIE_DATA',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  CHANGED: 'CHANGED',
};

export const MOVIE_COUNT_PER_STEP = 5;

export const NUMBER_OF_FIRST = 0;

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY : 'history',
  FAVORITES: 'favorites',
};

export const MenuItem = {
  MOVIES: 'movie',
  STATISTICS: 'statistics',
};

export const minutesInHour = 60;
