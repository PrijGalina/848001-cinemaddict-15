import SmartView from './smart.js';
import {emojiArray} from '../data.js';

const createNewCommentContainer = (choosenEmoji, comment = '') => {
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
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiSelectionTemplate}
      </div>
    </div>
  `);
};

const commentContainerTemplate = (commentsArray) => `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsArray.length}</span></h3>
      <ul class="film-details__comments-list"></ul>
      ${createNewCommentContainer()}
    </section>
  </div>`;

export default class CommentsList extends SmartView {
  constructor(comments) {
    super();
    this._commentsArray = comments;
    this._data = CommentsList.parseCommentToData(this._commentsArray);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return commentContainerTemplate(this._commentsArray);
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
    this._callback.formSubmit(CommentsList.parseDataToMovie(this._data));
  }

  _commentTextareaHandler(e) {
    e.preventDefault();
    this.updateData({
      comment: e.target.value,
    }, true);
    if(e.target.value !== ''){
      this.setFormSubmitHandler(this._callback.formSubmit);
    }
  }

  static parseCommentToData(comment) { // информация в состояние (когда редактируем)
    return Object.assign(
      {},
      comment,
      {
        isChoosenEmoji: comment.emotion,
      },
    );
  }

  static parseDataToComment(data) { // превращает состояние в информацию (когда сохраняем)
    data = Object.assign({}, data);

    if(!data.isChoosenEmojiForComment) {
      data.isChoosenEmojiForComment = '';
    }

    delete data.isChoosenEmojiForComment;
    return data;
  }


}
