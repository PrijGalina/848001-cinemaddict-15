import CommentView from '../view/comment';
import {render, remove, replace} from '../utils/render';
import {RenderPosition, UserAction, UpdateType} from './../const';

export default class Comment {
  constructor(container, changeData){
    this._container = container;
    this._changeData = changeData;
    this._commentComponent = null;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(comments){
    this._comments = comments;

    const prevCommentComponent = this._commentComponent;
    this._commentComponent = new CommentView(this._comments);
    this._commentComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevCommentComponent === null) {
      render(this._container, this._commentComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._commentComponent, prevCommentComponent);
    remove(prevCommentComponent);
  }

  destroy() {
    remove(this._commentComponent);
  }

  _handleDeleteClick(comment) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      comment,
    );
  }
}
