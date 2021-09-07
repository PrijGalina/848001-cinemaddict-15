import SmartView from './smart.js';
import {emojiArray} from '../data.js';

const createGenresList = (array) => {
  let code = '';
  array.forEach((item) => {
    const partCode = `<span class="film-details__genre">${item}</span>`;
    code = code + partCode;
  });
  return code;
};

const createCommentsTemplate = (array) => {
  let code = '';
  array.forEach((comment) => {
    const { emoji, text, date, autor } = comment;
    const oneComment = `
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
    code = code + oneComment;
  });
  return `<ul class="film-details__comments-list">${code}</ul>`;
};

const createNewCommentContainer = (choosenEmoji, commentText) => {
  const createEmojiSelectionTemplate = () => (
    emojiArray.map((emojiItem) => `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiItem}" value="${emojiItem}" ${choosenEmoji === emojiItem ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emojiItem}" data-value="${emojiItem}">
        <img src="./images/emoji/${emojiItem}.png" width="30" height="30" alt="emoji">
      </label>
    `).join('')
  );

  const emojiSelectionTemplate = createEmojiSelectionTemplate();
  const emojiSrc = (choosenEmoji) ? `style="background-image: url('/images/emoji/${choosenEmoji}.png'); background-size: contain;"` : '';
  return (`
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label" ${emojiSrc}></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiSelectionTemplate}
      </div>
    </div>
  `);
};

const createPopupMovieInfo = (movieData, commentsData) => {
  const {originalName, title, rating, release, duration, genres, poster, description, isFavorite, isHistory, isWatchlist, directors, writers, actors, country, ageRestrictions, isComments, countComments, isChoosenEmojiForComment, commentText} = movieData;
  const newRelease = `${release[0]} ${release[1]} ${release[2]}`;
  const genresList = createGenresList(genres);
  const commentsTemplate = createCommentsTemplate(commentsData);
  const getNewComment = createNewCommentContainer(isChoosenEmojiForComment, commentText);

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
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComments}</span></h3>
            ${isComments ? commentsTemplate : ''}
            ${getNewComment}
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MoviePopup extends SmartView {
  constructor(movie, comments) {
    super();
    this._data = MoviePopup.parseMovieToData(movie, comments);
    this._comments = comments;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchlistClickPopupHandler = this._watchlistClickPopupHandler.bind(this);
    this._favoriteClickPopupHandler = this._favoriteClickPopupHandler.bind(this);
    this._historyClickPopupHandler = this._historyClickPopupHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupMovieInfo(this._data, this._comments);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  _closeClickHandler(e) {
    e.preventDefault();
    this._callback.closeClick();
  }

  _setInnerHandlers(){
    const emojis = this.getElement().querySelectorAll('.film-details__emoji-label');
    emojis.forEach((emoji) => {
      emoji.addEventListener('click', this._emojiClickHandler);
    });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextareaHandler);
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  setWatchlistClickPopupHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickPopupHandler);
  }

  _watchlistClickPopupHandler(e) {
    e.preventDefault();
    this._callback.watchlistClick();
  }

  setFavoriteClickPopupHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickPopupHandler);
  }

  _favoriteClickPopupHandler(e) {
    e.preventDefault();
    this._callback.favoriteClick();
  }

  setHistoryClickPopupHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyClickPopupHandler);
  }

  _historyClickPopupHandler(e) {
    e.preventDefault();
    this._callback.historyClick();
  }

  _emojiClickHandler(e) {
    e.preventDefault();
    const value = e.target.parentElement.dataset.value;
    this.updateData({
      isChoosenEmojiForComment: value,
    }, false);
  }

  _formSubmitHandler(e) {
    e.preventDefault();
    this._callback.formSubmit(MoviePopup.parseDataToMovie(this._data));
  }

  _commentTextareaHandler(e) {
    e.preventDefault();
    this.updateData({
      commentText: e.target.value,
    }, true);
    if(e.target.value !== ''){
      this.setFormSubmitHandler(this._callback.formSubmit);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    //навесить обработчик
    document.addEventListener('keydown', (e) => {
      if((e.code === 'Enter') && e.ctrlKey) {
        //отправка данных в модель
      }
    });
  }

  static parseMovieToData(movie, comments) { // информация в состояние (когда редактируем)
    return Object.assign(
      {},
      movie,
      {
        isComments: comments.length > 0,
        isChoosenEmoji: movie.isChoosenEmojiForComment,
      },
    );
  }

  static parseDataToMovie(data) { // превращает состояние в информацию (когда сохраняем)
    data = Object.assign({}, data);
    if (!data.isComments) {
      data.countComments = 0;
    }

    if(!data.isChoosenEmojiForComment) {
      data.isChoosenEmojiForComment = '';
    }

    delete data.isChoosenEmojiForComment;
    delete data.isComments;
    return data;
  }
}
