import SmartView from './smart';
import dayjs from 'dayjs';

const createMovieCardTemplate = (movieData) => {
  const {comments, release, title, rating, duration, genres, poster, description, isWatchlist, isHistory, isFavorite} = movieData;
  const isActive = (boolean) => (boolean) ? 'film-card__controls-item film-card__controls-item--active' : 'film-card__controls-item';
  const isHidden = (value) => ((value === 0) || (value === 'NULL') || (value === undefined)) ? 'visually-hidden' : '';
  const releaseYear = dayjs(release).year();
  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments ${isHidden(comments.length)}">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item--add-to-watchlist ${isActive(isWatchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item--mark-as-watched ${isActive(isHistory)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item--favorite ${isActive(isFavorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class MovieCard extends SmartView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._openClickHandler = this._openClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  _openClickHandler(e) {
    e.preventDefault();
    this._callback.openClick();
  }

  _watchlistClickHandler(e) {
    e.preventDefault();
    this._callback.watchlistClick();
  }

  _favoriteClickHandler(e) {
    e.preventDefault();
    this._callback.favoriteClick();
  }

  _historyClickHandler(e) {
    e.preventDefault();
    this._callback.historyClick();
  }

  setOpenClickHandler(callback) {
    this._callback.openClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._historyClickHandler);
  }
}
