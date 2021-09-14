import {render, RenderPosition, remove} from '../utils/render';
import CommentsView from '../view/comment';

export default class Comments {
  constructor(){
    this._comment = null;
    this._commentsComponent = null;
    this._container = document.querySelector('.film-details__inner');
    //this._handleDeleteClick = this._handleDeleteClick.bind(this);
    //this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(comments){
    this._comments = comments;
    this._commentsComponent = new CommentsView(this._comments);
  }

  destroy() {
    remove(this._commentComponent);
  }

  _handleDeleteClick() {
    this._commentComponent.destroy();
  }

  _renderComments() {
    render(this._container, this._commentsComponent, RenderPosition.BEFOREEND);
  }
}
