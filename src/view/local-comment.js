import SmartView from './smart';
import {emojiArray} from '../const';

const createLocalCommentTemplate = (localCommentData) => {
  const {comment, emotion} = localCommentData;
  const emojiSrc = (emotion) ? `style="background-image: url('/images/emoji/${emotion}.png'); background-size: contain;"` : '';

  return (`<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label" ${emojiSrc}></div>
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
    </label>
    <div class="film-details__emoji-list">
      ${emojiArray.map((emojiItem) => `
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiItem}" value="${emojiItem}" ${emotion === emojiItem ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-${emojiItem}" data-value="${emojiItem}">
          <img src="./images/emoji/${emojiItem}.png" width="30" height="30" alt="emoji">
        </label>
      `).join('')}
    </div>
  </div>`);
};

export default class LocalComment extends SmartView {
  constructor(comment) {
    super();
    this._data = comment;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createLocalCommentTemplate(this._data);
  }

  _setInnerHandlers() {
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
      emotion: value,
    }, true);
    this._callback.emojiClick(this._data);
  }

  _commentTextareaHandler(e) {
    e.preventDefault();
    this.updateData({
      comment: e.target.value,
    }, true);
    if (e.target.value !== '') {
      this.setFormSubmitHandler(this._callback.formSubmit)
    }
    this._callback.textareaChange(this._data);
  }

  _formSubmitHandler(e) {
    e.preventDefault();
    this._callback.formSubmit();
  }

  setEmojiClickHandler(callback) {
    this._callback.emojiClick = callback;
  }

  setTextareaChange(callback) {
    this._callback.textareaChange = callback;
  }

  setFormSubmitHandler(callback) {
    document.addEventListener('keydown', (e) => { //навесить обработчик отправки формы добавления нового комментария
      if ((e.code === 'Enter') && e.ctrlKey) {
        //отправка данных в модель
        this._callback.formSubmit = callback;

      }
    });

  }
}
