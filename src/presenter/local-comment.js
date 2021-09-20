import {render, remove} from '../utils/render';
import {RenderPosition, UserAction, UpdateType} from '../const';
import LocalCommentView from '../view/local-comment';

export default class LocalComment {
  constructor(newCommentAddHandler) {
    this._comment = null;
    this._commentForm = null;
    this._newCommentAddHandler = newCommentAddHandler;
    this._container = document.querySelector('.film-details__comments-wrap');
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEmojiClick = this._handleEmojiClick.bind(this);
    this._handleTextareaChange = this._handleTextareaChange.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._renderBlock(comment);
  }

  destroy() {
    remove(this._commentForm);
  }

  _renderBlock(data) {
    this._commentForm = new LocalCommentView(data, this._handleFormSubmit);
    //this._commentForm.setFormSubmitHandler(this._handleFormSubmit);
    this._commentForm.setEmojiClickHandler(this._handleEmojiClick);
    this._commentForm.setTextareaChange(this._handleTextareaChange);
    render(this._container, this._commentForm, RenderPosition.BEFOREEND);
  }

  _handleEmojiClick(data) {
    remove(this._commentForm);
    this._renderBlock(data);
  }

  _handleTextareaChange(data) {
    //if (this._commentForm._callback)
    const callbackNameArray = Object.getOwnPropertyNames((this._commentForm._callback));
    (callbackNameArray.includes('formSubmit')) ? '' : this._commentForm.setFormSubmitHandler(this._handleFormSubmit);
  }

  _handleFormSubmit(comment) {
    this._newCommentAddHandler(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      comment,
    );
  }
}
