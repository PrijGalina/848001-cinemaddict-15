import NewCommentView from '../view/new-comment';
import {nanoid} from 'nanoid';
import {render, remove} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition} from '../const.js';

export default class NewComment {
  constructor(commentListContainer, changeData) {
    this._commentListContainer = commentListContainer;
    this._changeData = changeData;

    this._newCommentComponent = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init() {
    if (this._newCommentComponent !== null) {
      return;
    }

    this._newCommentComponent = new NewCommentView();
    this._newCommentComponent.setFormSubmitHandler(this._handleFormSubmit);
    render(this._commentListContainer, this._newCommentComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    if (this._newCommentComponent === null) {
      return;
    }
    remove(this._newCommentComponent);
    this._newCommentComponent = null;
  }

  _handleFormSubmit(comment) {
    this._changeData(comment);
  }
}
