import {render, RenderPosition, remove} from '../utils/render';
import CommentsView from '../view/comment';

export default class Comments {
  constructor(){
    this._comment = null;
    this._commentsComponent = null;
    this._container = document.querySelector('.film-details__inner');
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(comments){
    this._comments = comments;
    this._commentsComponent = new CommentsView(this._comments);
    this._commentsComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._renderComments();
  }

  destroy() {
    remove(this._commentComponent);
  }

  _handleDeleteClick() {
    //this._commentComponent.destroy();
    console.log('gfds');
  }

  _renderComments() {
    render(this._container, this._commentsComponent, RenderPosition.BEFOREEND);
  }
}
