import СommentPresenter from './comment';
import NewCommentPresenter from './comment-new';
import {UserAction, UpdateType, RenderPosition} from '../const';
import { render, remove } from '../utils/render';

export default class CommentsList {
  constructor(container, commentsModel, handlerMovieUpdate) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._handlerMovieUpdate = handlerMovieUpdate;

    this._commentsPresenter = new Map();

    this._handleCommentViewAction = this._handleCommentViewAction.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);
    this._updateCommentsList = this._updateCommentsList.bind(this);

    this._commentsModel.addObserver(this._handleCommentModelEvent);
  }

  init() {
    this._newCommentInit();
  }

  destroy() {
    if (this._commentsPresenter) {
      this._commentsPresenter.forEach((presenter) => presenter.destroy());
    }
    if (this._NewCommentPresenter) {
      this._NewCommentPresenter.destroy();
    }
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _commentsRender(commentsArray) {
    let itemPresenter = '';
    commentsArray.forEach((commentItem) => {
      itemPresenter = new СommentPresenter(this._container, this._handleCommentViewAction, this._commentsModel);
      itemPresenter.init(commentItem);
      this._commentsPresenter.set(commentItem.id, itemPresenter);
    });
  }

  _commentsClear(commentsArray) {
    commentsArray.forEach((commentItem) => {
      (this._commentsPresenter.get(commentItem.id)) ? this._commentsPresenter.get(commentItem.id).destroy() : '';
      this._commentsPresenter.clear();
    });
  }

  _newCommentInit() {
    this._NewCommentPresenter = new NewCommentPresenter(this._container, this._handleCommentViewAction);
    this._NewCommentPresenter.init();
  }

  _handleCommentViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComments(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComments(updateType, update);
        break;
    }
  }

  _handleCommentModelEvent(updateType, data) {
    const commentsListUpdate = this._getComments();
    (commentsListUpdate.length > 0) ? this._commentsRender(commentsListUpdate) : '';
    switch (updateType) {
      case UpdateType.PATCH:
        this._data = data;
        this._commentsList = commentsListUpdate.map((comment) => comment);
        this._handlerMovieUpdate(this._commentsList);
        break;
      case UpdateType.MINOR:
        this._commentsList = commentsListUpdate.map((comment) => comment);
        this._handlerMovieUpdate(this._commentsList);
        break;
      case UpdateType.MAJOR:
        break;
    }
  }

  _updateCommentsList() {
    this._commentsBlockContainer = document.querySelector('.film-details__comments-list');
    this._commentsPresenter.forEach((el) => {
      remove(el._commentComponent);
    });
    this.destroy();
    this._commentsPresenter.clear();
    this.init();
    this._commentsPresenter.forEach((el) => {
      render(this._commentsBlockContainer, el._commentComponent, RenderPosition.BEFOREEND);
    });
    this._newCommentsBlockContainer = document.querySelector('.film-details__comments-wrap');
    render(this._newCommentsBlockContainer, this._NewCommentPresenter._newCommentComponent, RenderPosition.BEFOREEND);
  }
}

