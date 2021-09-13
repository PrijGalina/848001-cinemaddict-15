import {render, RenderPosition, remove} from '../utils/render';
//, replace
import CommentsView from '../view/comment';

export default class Comments {
  constructor(){
    this._comment = null;
    this._commentComponent = null;
    //this._handleDeleteClick = this._handleDeleteClick.bind(this);
    //this._handleAddComment = this._handleAddComment.bind(this);
    this._place = document.querySelector('.film-details__comments-list');
  }

  init(comment){
    this._comment = comment;
    this._commentComponent = new CommentsView(comment);
    console.log(document.querySelector('.film-details__comments-list'));
    if(this._commentComponent !== null) {
      //render(this._place, this._commentComponent, RenderPosition.BEFOREEND);
    }
    //this._renderComment();
  }

  destroy() {
    remove(this._commentComponent);
  }

  _renderComment() {
  }

  _handleDeleteClick() {
    this._commentComponent.destroy();
  }
}
