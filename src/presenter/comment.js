import {render, RenderPosition, remove} from '../utils/render';
//, replace
import CommentsView from '../view/comment';

export default class Comments {
  constructor(){
    this._comment = null;
    this._commentComponent = null;
    this._place = null;
    //this._handleDeleteClick = this._handleDeleteClick.bind(this);
    //this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(comment){
    this._comment = comment;
    this._commentComponent = new CommentsView(this._comment);
    this._place = document.querySelector('.film-details__comments-list');
    this._renderComment(this._place);
  }

  destroy() {
    remove(this._commentComponent);
  }

  _renderComment(container) {
    if(container !== null) {
      console.log(container);
      render(container, this._commentComponent, RenderPosition.BEFOREEND);
    }
  }

  _handleDeleteClick() {
    this._commentComponent.destroy();
  }
}
