import {createElement} from '../utils.js';

const createMovieCardTemplate = (movieData) => {
  const { title, rating, release, duration, genres, poster, description, countComments, isFavorite, isWatched, isWatchlist } = movieData;
  const isActive = (boolean) => (boolean) ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';
  const isHidden = (value) => ((value === 0) || (value === 'NULL') || (value === undefined)) ? 'visually-hidden' : '';

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${release[2]}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments ${isHidden(countComments)}">${countComments} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item--add-to-watchlist ${isActive(isWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item--mark-as-watched ${isActive(isWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item--favorite ${isActive(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class MovieCard {
  constructor(movie) {
    this._movie = movie;
    this._element = null;
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
