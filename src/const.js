

export const emojiArray = ['smile', 'sleeping', 'puke', 'angry'];

export const MOVIE_COUNT = 12;

export const COMMENTS_COUNT = 10;

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
  BY_COMMENTS_COUNT: 'comments',
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
  WRITE_COMMENT: 'WRITE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_MOVIE_DATA: 'UPDATE_MOVIE_DATA',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
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
