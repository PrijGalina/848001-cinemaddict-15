import SmartView from './smart';
import dayjs from 'dayjs';


const createGenresList = (array) => {
  let code = '';
  array.forEach((item) => {
    const partCode = `<span class="film-details__genre">${item}</span>`;
    code = code + partCode;
  });
  return code;
};

const createPopupMovieInfo = (movieData) => {
  const { comments, release, title, rating, duration, genres, poster, description, isWatchlist, isHistory, isFavorite, ageRestrictions, originalName, director, writers, actors, country} = movieData;
  const releaseWithFormat = dayjs(release).format('D MMMM YYYY');
  const genresList = createGenresList(genres);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRestrictions}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${originalName}</h3>
                  <p class="film-details__title-original">${title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseWithFormat}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">${genresList}</td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button--watchlist ${(isWatchlist) ? 'film-details__control-button film-details__control-button--active' : 'film-details__control-button'}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button--watched ${(isHistory) ? 'film-details__control-button film-details__control-button--active' : 'film-details__control-button'}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button--favorite ${(isFavorite) ? 'film-details__control-button film-details__control-button--active' : 'film-details__control-button'}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list"></ul>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MoviePopup extends SmartView {
  constructor(movie) {
    super();
    this._movie = movie;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupMovieInfo(this._movie);
  }

  _closeClickHandler(e) {
    e.preventDefault();
    this._callback.closeClick();
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

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyClickHandler);
  }
}
