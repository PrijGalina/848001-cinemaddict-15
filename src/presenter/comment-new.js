import NewCommentView from '../view/comment-new';
import {nanoid} from 'nanoid';
import {render, remove} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition} from '../const.js';
import { getRandomElement } from '../utils/common';
import { workingGroup } from './../data';
import { getCurrentDate } from '../mock/comment';

const NEW_COMMENT_TEMPLATE = {
  comment: '',
  emotion: null,
  autor: getRandomElement(workingGroup),
  date: getCurrentDate(),
};

export default class NewComment {
  constructor(commentListContainer, changeData, filmId) {
    this._commentListContainer = commentListContainer;
    this._changeData = changeData;
    this._filmId = filmId;

    this._newCommentComponent = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init() {
    this._newCommentComponent = new NewCommentView(NEW_COMMENT_TEMPLATE, this._handleFormSubmit);
    render(this._commentListContainer, this._newCommentComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._newCommentComponent);
  }

  _handleFormSubmit(comment) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign({ id: nanoid(), aboutFilm: this._filmId }, comment),
    );
  }
}
