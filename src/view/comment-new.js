import he from 'he';
import SmartView from './smart';
import {emojiArray} from '../const';

const createNewCommentTemplate = (NewCommentData) => {
  const {comment, emotion} = NewCommentData;
  const emojiSrc = (emotion !== null) ? `style="background-image: url('/images/emoji/${emotion}.png'); background-size: contain;"` : 'background-color: rgba(255, 255, 255, 0.1);';

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

export default class NewComment extends SmartView {
  constructor(newCommentTemplate, formSubmitCallback) {
    super();
    this._data = NewComment.parseCommentToData(newCommentTemplate);
    this._formSubmitCallback = formSubmitCallback;
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);
    this._handlerEnterCtrl = this._handlerEnterCtrl.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewCommentTemplate(this._data);
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

  restoreEmojiHandlers() {
    this._setInnerHandlers();
  }

  _emojiClickHandler(e) {
    e.preventDefault();
    const value = e.target.parentElement.dataset.value;
    this.updateDataElement({
      emotion: value,
    });
  }

  _commentTextareaHandler(e) {
    e.preventDefault();
    this.updateData({
      comment: e.target.value,
    }, true);
    if (this._data.comment !== ''){
      document.addEventListener('keydown', this._handlerEnterCtrl);
    }
    else {
      document.removeEventListener('keydown', this._handlerEnterCtrl);
    }
  }


  _handlerEnterCtrl(e) {
    if ((e.code === 'Enter') && e.ctrlKey) {
      console.log('yt');
      this._formSubmitCallback(NewComment.parseDataToComment(this._data));
      document.removeEventListener('keydown', this._handlerEnterCtrl);
    }
  }

  static parseCommentToData(comment) {
    return Object.assign(
      {},
      comment,
      {
        comment: comment.comment,
        emotion: comment.emotion,
      },
    );
  }

  static parseDataToComment(data) {
    data = Object.assign({}, data);

    return data;
  }
}
