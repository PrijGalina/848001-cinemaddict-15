import he from 'he';
import SmartView from './smart';
import {getFormattedDate} from '../utils/common';

const createCommentsTemplate = (commentData) => {
  const {emotion, comment, date, author} = commentData;
  return `<li class='film-details__comment'>
    <span class='film-details__comment-emoji'>
      <img src='./images/emoji/${emotion}.png' width='55' height='55'' alt='emoji-smile'>
    </span>
    <div>
      <p class='film-details__comment-text'>${he.encode(comment)}</p>
      <p class='film-details__comment-info'>
        <span class='film-details__comment-author'>${author}</span>
        <span class='film-details__comment-day'>${getFormattedDate(date)}</span>
        <button class='film-details__comment-delete'>Delete</button>
      </p>
    </div>
  </li>`;
};

export default class Comment extends SmartView {
  constructor(comment) {
    super();
    this._comment = comment;

    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createCommentsTemplate(this._comment);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._deleteClickHandler);
  }

  _deleteClickHandler(e) {
    e.preventDefault();
    this._callback.deleteClick(this._comment);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
  }
}
