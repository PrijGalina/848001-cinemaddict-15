import AllMoviesView from './view/all-movies-block';
import TopRatedView from './view/rated-movies-block';
import MostCommentedView from './view/commented-movies-block';

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
    view: new AllMoviesView(),
    presenter: '',
    container: 0,
    movieCount: 5,
  },
  COMMENTED: {
    view: new MostCommentedView(),
    presenter: '',
    container: 1,
    movieCount: 2,
  },
  RATED: {
    view: new TopRatedView(),
    presenter: '',
    container: 2,
    movieCount: 2,
  },
};

export const TEMPLATE_NEW_COMMENT = {
  comment: '',
  emotion: null,
};

export const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_MOVIE_DATA: 'UPDATE_MOVIE_DATA',
  UPDATE_MOVIE_VIEW: 'UPDATE_MOVIE_VIEW',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
