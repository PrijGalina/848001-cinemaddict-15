import AbstractView from './abstract.js';

const createPopupMovieInfo = (movieData, commentsData) => {
  const { originalName, title, rating, release, duration, genres, poster, description, isFavorite, isHistory, isWatchlist, directors, writers, actors, country, ageRestrictions} = movieData;
  const isActive = (boolean) => (boolean) ? 'film-details__control-button film-details__control-button--active' : 'film-details__control-button';
  const newRelease = `${release[0]} ${release[1]} ${release[2]}`;
  const getGenresList = (genresArray) => {
    let finalСode = '';
    genresArray.forEach((genre) => {
      const genreElement = `<span class="film-details__genre">${genre}</span>`;
      finalСode = finalСode + genreElement;
    });
    return finalСode;
  };
  const getCommentsBlock = (commentsArray) => {
    let finalСode = '';
    commentsArray.forEach((comment) => {
      const { emoji, text, date, autor } = comment;
      const commentElement = `
        <li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${autor}</span>
              <span class="film-details__comment-day">${date}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`;
      finalСode = finalСode + commentElement;
    });
    return finalСode;
  };
  const getCountComments = (commentsArray) => commentsArray.length;

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
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${originalName}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${directors}</td>
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
                  <td class="film-details__cell">${newRelease}</td>
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
                  <td class="film-details__cell">
                    ${getGenresList(genres)}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button--watchlist ${isActive(isWatchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button--watched ${isActive(isHistory)}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button--favorite ${isActive(isFavorite)}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${getCountComments(commentsData)}</span></h3>

            <ul class="film-details__comments-list">${getCommentsBlock(commentsData)}</ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MoviePopup extends AbstractView {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
    this._closeClickHandler = this._closeClickHandler.bind(this);

    this._watchlistClickPopupHandler = this._watchlistClickPopupHandler.bind(this);
    this._favoriteClickPopupHandler = this._favoriteClickPopupHandler.bind(this);
    this._historyClickPopupHandler = this._historyClickPopupHandler.bind(this);
  }

  getTemplate() {
    return createPopupMovieInfo(this._movie, this._comments);
  }

  _closeClickHandler(e) {
    e.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  _watchlistClickPopupHandler(e) {
    e.preventDefault();
    this._callback.watchlistClick();
  }

  _favoriteClickPopupHandler(e) {
    e.preventDefault();
    this._callback.favoriteClick();
  }

  _historyClickPopupHandler(e) {
    e.preventDefault();
    this._callback.historyClick();
  }

  setWatchlistClickPopupHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickPopupHandler);
  }

  setFavoriteClickPopupHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickPopupHandler);
  }

  setHistoryClickPopupHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyClickPopupHandler);
  }
}
