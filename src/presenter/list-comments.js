import { render, RenderPosition, remove } from '../utils/render';
import CommentListView from '../view/list-comment';

export default class Comments {
  constructor() {
    this._comments = null;
    this._commentsListComponent = null;
    this._container = document.querySelector('.film-details__inner');
  }

  init(comments) {
    this._comments = comments;
    this._commentsListComponent = new CommentListView(this._comments);
    //this._commentsComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._renderComments();
    if (this._comments.length > 0){
      this._comments.forEach((commentItem) => {
        this._commentItemPresenter = new СommentsPresenter();
        this._commentItemPresenter.init(commentItem);
      });
    }
  }

  destroy() {
    remove(this._commentsListComponent);
  }

  _renderComments() {
    render(this._container, this._commentsListComponent, RenderPosition.BEFOREEND);
  }
}
