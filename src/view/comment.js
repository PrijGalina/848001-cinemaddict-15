import he from 'he';
import { remove } from '../utils/render';
import SmartView from './smart';

const createCommentsTemplate = (commentData) => {
  const {emotion, comment, date, autor} = commentData;
  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      ${(emotion !== null) ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : '<div class="film-details__add-emoji-label" style="background-color:rgba(255,255,255,0.1);width: 55px; height: 55px"></div>'}
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${autor}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class Comment extends SmartView {
  constructor(comment) {
    super();
    this._comment = comment;
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._comment);
  }

  _deleteClickHandler(e) {
    e.preventDefault();
    this._callback.deleteClick();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._deleteClickHandler);
  }
}
