import CommentView from '../view/comment';
import {render, remove} from '../utils/render';
import {RenderPosition, UserAction, UpdateType} from './../const';

export default class Comment {
  constructor(container, commentChange){
    this._comment = null;
    this._commentComponent = null;
    this._container = container;
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._commentChange = commentChange;
  }

  init(comments){
    this._comments = comments;
    this._commentComponent = new CommentView(this._comments);
    this._commentComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._renderComments();
  }

  destroy() {
    remove(this._commentComponent);
  }

  _renderComments() {
    render(this._container, this._commentComponent, RenderPosition.BEFOREEND);
  }

  _handleDeleteClick() {
    this._commentChange(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      this._comments,
    );
  }
}
