import {render, remove, replace} from '../utils/render';
import CommentsListView from '../view/list-comment';
import СommentsPresenter from './comment';
import { RenderPosition, TEMPLATE_NEW_COMMENT} from './../data';

export default class CommentsList {
  constructor(commentsListChange) {
    this._comments = null;
    this._newComment = null;
    this._commentsListComponent = null;
    this._commentsListChange = commentsListChange;
    this._mainContainer = document.querySelector('.film-details__inner');
    this._handlerCommentChange = this._handlerCommentChange.bind(this);
    this._handlerEmojiChange = this._handlerEmojiChange.bind(this);
  }

  init(comments) {
    this._comments = comments;
    this._newComment = TEMPLATE_NEW_COMMENT;
    const prevCommentsList = this._commentsListComponent;
    this._commentsListComponent = new CommentsListView(this._comments, this._newComment);
    this._commentsListComponent.setEmojiClickHandler(this._handlerEmojiChange);
    if(prevCommentsList === null) {
      this._renderCommentsView();
      return;
    }

    replace(this._commentsListComponent, prevCommentsList);
    this._renderCommentsView();
    remove(prevCommentsList);
  }

  _renderCommentsView() {
    render(this._mainContainer, this._commentsListComponent, RenderPosition.BEFOREEND);
    (this._comments.length > 0) ? this._commentsRender(this._comments) : '';
  }

  destroy() {
    remove(this._commentsListComponent);
  }

  _commentsRender(commentsArray) {
    commentsArray.forEach((commentItem) => {
      this._commentItemPresenter = new СommentsPresenter(this._handlerCommentChange);
      this._commentItemPresenter.init(commentItem);
    });
  }

  _handlerCommentChange(updated) {
    this._commentsListChange(updated);
  }

  _handlerEmojiChange(){

  }
}
