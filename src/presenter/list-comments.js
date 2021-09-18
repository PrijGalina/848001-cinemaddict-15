import {render, remove, replace} from '../utils/render';
import CommentsListView from '../view/list-comment';
import СommentsPresenter from './comment';
import {RenderPosition, TEMPLATE_NEW_COMMENT} from './../const';
import LocalCommentPresenter from './local-comment';

export default class CommentsList {
  constructor(commentsListChange, commentAddList) {
    this._comments = null;
    this._commentsListComponent = null;
    this._localCommentTemplate = TEMPLATE_NEW_COMMENT;
    this._commentsListChange = commentsListChange;
    this._commentAddList = commentAddList;
    this._mainContainer = document.querySelector('.film-details__inner');
    this._handlerCommentChange = this._handlerCommentChange.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(comments) {
    this._comments = comments;
    const prevCommentsList = this._commentsListComponent;
    this._commentsListComponent = new CommentsListView(this._comments);

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
    this._localCommentInit();
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

  _localCommentInit() {
    this._localCommentPresenter = new LocalCommentPresenter(this._handleFormSubmit);
    this._localCommentPresenter.init(this._localCommentTemplate);
  }

  _handlerCommentChange(updated) {
    this._commentsListChange(updated);
  }

  _handleFormSubmit(comment) {
    console.log('dfghjk');
    //this._commentAddList(comment);
  }
}
