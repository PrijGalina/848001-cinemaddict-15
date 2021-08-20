import AbstractView from './abstract.js';

const createMenuTemplate = (moviesArray) => {
  const getWathedCount = (array) => array.filter((film) => film.isWatched === true).length;

  const getFavoriteCount = (array) => array.filter((film) => film.isFavorite === true).length;

  const getHistoryCount = (array) => array.filter((film) => film.isWatchlist === true).length;

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${getWathedCount(moviesArray)}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${getHistoryCount(moviesArray)}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${getFavoriteCount(moviesArray)}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {
    return createMenuTemplate(this._movies);
  }
}
