import {render, remove} from '../utils/render';
import {RenderPosition} from '../const';
import LocalCommentView from '../view/local-comment';

export default class LocalComment {
  constructor(formSubmitHandler) {
    this._comment = null;
    this._commentForm = null;
    this._formSubmitHandler = formSubmitHandler;
    this._container = document.querySelector('.film-details__comments-wrap');
    this._handleEmojiClick = this._handleEmojiClick.bind(this);
    this._handleTextareaChange = this._handleTextareaChange.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._renderBlock(comment);
  }

  destroy() {
    remove(this._commentComponent);
  }

  _renderBlock(data) {
    this._commentForm = new LocalCommentView(data);
    this._commentForm.setEmojiClickHandler(this._handleEmojiClick);
    this._commentForm.setTextareaChange(this._handleTextareaChange);
    render(this._container, this._commentForm, RenderPosition.BEFOREEND);
  }

  _handleEmojiClick(data) {
    remove(this._commentForm);
    this._renderBlock(data);
  }

  _handleTextareaChange() {

  }
}
