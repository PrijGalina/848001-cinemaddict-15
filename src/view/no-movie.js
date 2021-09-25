import AbstractView from './abstract';
import {FilterType} from '../const';

const NoMoviesTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoMovieTemplate = (filterType) => {
  const message = NoMoviesTextType[filterType];

  return (`<section class='films-list'><h2 class='films-list__title'>${message}</h2></section>`);
};

export default class NoMovie extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoMovieTemplate(this._data);
  }
}
