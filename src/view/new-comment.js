import SmartView from './smart';
import {emojiArray} from '../const';
import { createElement } from '../utils/common';

const createNewCommentTemplate = (NewCommentData) => {
  const {comment, emotion} = NewCommentData;
  const emojiSrc = `style='background-image: url('/images/emoji/${emotion}.png'); background-size: contain;'`;

  return (`<div class='film-details__new-comment'>
    <div class='film-details__add-emoji-label' ${emojiSrc}></div>
    <label class='film-details__comment-label'>
      <textarea class='film-details__comment-input' placeholder='Select reaction below and write comment here' name='comment'>${comment}</textarea>
    </label>
    <div class='film-details__emoji-list'>
      ${emojiArray.map((emojiItem) => `
        <input class='film-details__emoji-item visually-hidden' name='comment-emoji' type='radio' id='emoji-${emojiItem}' value='${emojiItem}' ${emotion === emojiItem ? 'checked' : ''}>
        <label class='film-details__emoji-label' for='emoji-${emojiItem}' data-value='${emojiItem}'>
          <img src='./images/emoji/${emojiItem}.png' width='30' height='30' alt='emoji'>
        </label>
      `).join('')}
    </div>
  </div>`);
};

const TEMPLATE = {
  comment: '',
  emotion: null,
};

export default class NewComment extends SmartView {
  constructor(newComment = TEMPLATE) {
    super();
    this._data = newComment;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewCommentTemplate(this._data);
  }

  _setInnerHandlers() {
    const emojis = this.getElement().querySelectorAll(
      '.film-details__emoji-label',
    );
    emojis.forEach((emoji) => {
      emoji.addEventListener('click', this._emojiClickHandler);
    });
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentTextareaHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  updateElement(data) {
    this._data = data;
    const newElement = createElement(this.getTemplate());
    this._element.replaceChildren(...newElement.children);
    this._setInnerHandlers();
  }

  _emojiClickHandler(e) {
    e.preventDefault();
    const emotion = e.target.parentElement.dataset.value;
    this.updateElement({ ...this._data, emotion });
  }

  _commentTextareaHandler(e) {
    e.preventDefault();
    this.updateData(
      {
        comment: e.target.value,
      },
      true,
    );
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this._formSubmitHandler);
  }

  _formSubmitHandler(e) {
    if (
      e.code === 'Enter' &&
      (e.ctrlKey || e.metaKey) &&
      this._data.comment &&
      this._data.emotion
    ) {
      this._callback.formSubmit(this._data);
      this.updateData({ ...TEMPLATE }, true);
    }
  }
}
