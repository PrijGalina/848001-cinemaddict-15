import NewCommentView from '../view/comment-new';
import {nanoid} from 'nanoid';
import {render, remove, replace} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition} from '../const.js';

const NEW_COMMENT_TEMPLATE = {
  comment: '',
  emotion: null,
};

export default class NewComment {
  constructor(commentListContainer, changeData, filmId) {
    this._commentListContainer = commentListContainer;
    this._changeData = changeData;
    this._filmId = filmId;

    this._newCommentComponent = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init() {
    const prevnewCommentComponent = this._newCommentComponent;
    this._newCommentComponent = new NewCommentView(NEW_COMMENT_TEMPLATE, this._handleFormSubmit);

    if (prevnewCommentComponent === null) {
      render(this._commentListContainer, this._newCommentComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._newCommentComponent, prevnewCommentComponent);
    remove(prevnewCommentComponent);

  }

  destroy() {
    remove(this._newCommentComponent);
  }

  _handleFormSubmit(comment) {
    //на сервер add
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign({ id: nanoid(), aboutFilm: this._filmId }, comment),
    );
  }
}
