import СommentPresenter from './comment';
import LocalCommentPresenter from './local-comment';
import {TEMPLATE_NEW_COMMENT, UserAction, UpdateType} from './../const';

export default class CommentsList {
  constructor(container, commentsModel, needMovieUpdate, filmId) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._needMovieUpdate = needMovieUpdate;
    this._filmId = filmId;
    this._localCommentTemplate = TEMPLATE_NEW_COMMENT;

    this._comments = null;
    this._commentsPresenter = new Map();

    this._handleCommentViewAction = this._handleCommentViewAction.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleCommentModelEvent);
  }

  init() {
    this._comments = this._getComments(this._filmId);
    (this._comments.length > 0) ? this._commentsRender(this._comments) : '';
    this._localCommentInit();
  }

  _getComments(filmId) {
    return this._commentsModel.getComments().filter((comment) => comment.aboutFilm === filmId);
  }

  _commentsRender(commentsArray) {
    let itemPresenter = '';
    commentsArray.forEach((commentItem) => {
      itemPresenter = new СommentPresenter(this._handleCommentViewAction);
      itemPresenter.init(commentItem);
      this._commentsPresenter.set(commentItem.id, itemPresenter);
    });
  }

  _localCommentInit() {
    this._localCommentPresenter = new LocalCommentPresenter(this._handleCommentViewAction);
    this._localCommentPresenter.init(this._localCommentTemplate);
  }

  _handleCommentViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.WRITE_COMMENT:
        //this._commentsModel.addComments(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComments(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComments(updateType, update);
        break;
    }
  }

  _handleCommentModelEvent(updateType, data) {
    const commentsListUpdate = this._getComments(this._filmId);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить элемент создания нового комментария

        break;
      case UpdateType.MINOR:
        this._needMovieUpdate(commentsListUpdate);
        break;
      case UpdateType.MAJOR:
        break;
    }
  }
}
