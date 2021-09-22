import CommentView from '../view/comment';
import {render, remove, replace} from '../utils/render';
import {RenderPosition, UserAction, UpdateType} from './../const';
import { api} from '../main';

export default class Comment {
  constructor(container, commentChange, commentsModel){
    this._comment = null;
    this._commentComponent = null;
    this._container = container;
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._commentChange = commentChange;
    this._commentsModel = commentsModel;
    this._api = api;
  }

  init(comments){
    const prevCommentComponent = this._commentComponent;

    this._comments = comments;
    this._commentComponent = new CommentView(this._comments);
    this._commentComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevCommentComponent === null) {
      this._renderComments();
      return;
    }
    replace(this._commentComponent, prevCommentComponent);
    remove(prevCommentComponent);
  }

  destroy() {
    remove(this._commentComponent);
  }

  _renderComments() {
    render(this._container, this._commentComponent, RenderPosition.AFTERBEGIN);
  }

  _handleDeleteClick(update) {
    this._api.deleteComment(update).then(() => {
      this._commentChange(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        update,
      );
    });
  }
}
