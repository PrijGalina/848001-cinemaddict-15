import {render, remove} from '../utils/render';
import {RenderPosition} from './../const';
import CommentsView from '../view/comment';

export default class Comments {
  constructor(commentChange){
    this._comment = null;
    this._commentsComponent = null;
    this._container = document.querySelector('.film-details__comments-list');
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._commentChange = commentChange;
  }

  init(comments){
    this._comments = comments;
    this._commentsComponent = new CommentsView(this._comments, this._handlerListChange);
    this._commentsComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._renderComments();
  }

  destroy() {
    remove(this._commentComponent);
  }

  _renderComments() {
    render(this._container, this._commentsComponent, RenderPosition.BEFOREEND);
  }

  _handleDeleteClick() {
    this._commentChange(this);
    remove(this._commentsComponent);
  }
}
