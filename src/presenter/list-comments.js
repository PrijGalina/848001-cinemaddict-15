import {render, remove, replace} from '../utils/render';
import CommentsListView from '../view/list-comment';
import СommentsPresenter from './comment';
import {RenderPosition} from './../data';

export default class CommentsList {
  constructor(commentsListChange) {
    this._comments = null;
    this._commentsListComponent = null;
    this._commentsListChange = commentsListChange;
    this._container = document.querySelector('.film-details__inner');
    this._handlerCommentChange = this._handlerCommentChange.bind(this);
    this._handlerEmojiChange = this._handlerEmojiChange.bind(this);
  }

  init(comments) {
    this._comments = comments;
    const prevCommentsList = this._commentsListComponent;
    this._commentsListComponent = new CommentsListView(this._comments);

    if(prevCommentsList === null) {
      render(this._container, this._commentsListComponent, RenderPosition.BEFOREEND);
      (this._comments.length > 0) ? this._commentsRender(this._comments) : '';
      return;
    }


    replace(this._commentsListComponent, prevCommentsList);
    render(this._container, this._commentsListComponent, RenderPosition.BEFOREEND);
    (this._comments.length > 0) ? this._commentsRender(this._comments) : '';
    remove(prevCommentsList);
  }

  destroy() {
    remove(this._commentsListComponent);
  }

  _commentsRender(commentsArray) {
    commentsArray.forEach((commentItem) => {
      this._commentItemPresenter = new СommentsPresenter(this._handlerCommentChange);
      //this._commentItemPresenter.set
      this._commentItemPresenter.init(commentItem);
    });
  }

  _handlerCommentChange(updated) {
    this._commentsListChange(updated);
  }

  __handlerEmojiChange() {
    console.log('EmojiChange');
  }
}
