import SmartView from './smart.js';
import {emojiArray} from '../data.js';

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

const createNewCommentContainer = (choosenEmoji, text) => {
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
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiSelectionTemplate}
      </div>
    </div>
  `);
};

const createComments = (commentsData) => {
  const {isChoosenEmojiForComment, text} = commentsData;

  const commentsTemplate = createCommentsTemplate(commentsData);
  const getNewComment = createNewCommentContainer(isChoosenEmojiForComment, text);

  return (
    `
      ${commentsTemplate}
      ${getNewComment}
    `
  );
};

export default class Comments extends SmartView {
  constructor(comments) {
    super();
    this._data = Comments.parseMovieToData(comments);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createComments(this._comments);
  }

  _setInnerHandlers(){
    const emojis = this.getElement().querySelectorAll('.film-details__emoji-label');
    emojis.forEach((emoji) => {
      emoji.addEventListener('click', this._emojiClickHandler);
    });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextareaHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _emojiClickHandler(e) {
    e.preventDefault();
    const value = e.target.parentElement.dataset.value;
    this.updateData({
      isChoosenEmojiForComment: value,
    }, false);
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

  _formSubmitHandler(e) {
    e.preventDefault();
    this._callback.formSubmit(Comments.parseDataToMovie(this._data));
  }

  _commentTextareaHandler(e) {
    e.preventDefault();
    this.updateData({
      text: e.target.value,
    }, true);
    if(e.target.value !== ''){
      this.setFormSubmitHandler(this._callback.formSubmit);
    }
  }

  static parseMovieToData(movie, comments) { // информация в состояние (когда редактируем)
    return Object.assign(
      {},
      movie,
      {
        isChoosenEmoji: comments.isChoosenEmojiForComment,
      },
    );
  }

  static parseDataToMovie(data) { // превращает состояние в информацию (когда сохраняем)
    data = Object.assign({}, data);

    if(!data.isChoosenEmojiForComment) {
      data.isChoosenEmojiForComment = '';
    }

    delete data.isChoosenEmojiForComment;
    return data;
  }

}
