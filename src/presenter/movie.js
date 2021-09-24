import СommentPresenter from './comment';
import NewCommentPresenter from './new-comment';
import MoviePopupView from '../view/movie-popup';
import MovieCardView from '../view/movie-card';
import {render, remove, replace} from '../utils/render';
import {RenderPosition, Mode, UserAction, UpdateType} from './../const';

export default class Movie {
  constructor(container, moviesModel, commentsModel, api, changeData, changeMode) {
    this._container = container;
    this._api = api;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._movieComponent = null;
    this._popupComponent = null;
    this._сollectionСommentsPresenter = new Map();
    this._NewCommentPresenter = null;
    this._comments = null;
    this._mode = Mode.DEFAULT;
    this._overlay = document.querySelector('.overlay');
    this._body = document.querySelector('body');

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleCommentModelEvent = this._handleModelEvent.bind(this);
    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    this._containerForMovie = this._container.getElement().querySelector('.films-list__container');

    this._movieComponent = new MovieCardView(this._movie);
    this._movieComponent.setOpenClickHandler(this._handleOpenPopupClick);
    this._movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setHistoryClickHandler(this._handleHistoryClick);

    this._commentsModel.addObserver(this._handleModelEvent);
    //this._moviesModel.addObserver(this._handleModelEvent);

    if (prevMovieComponent === null){
      render(this._containerForMovie, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._movieComponent, prevMovieComponent);

    remove(prevMovieComponent);
  }

  _getAndRenderComments() {
    this._api.getComments(this._movie)
      .then((comments) => {
        this._commentsModel.setComments(UpdateType.INIT, comments);
      })
      .then(() => {
        this._renderComments();
      })
      .catch(() => {
        this._commentsModel.setComments(UpdateType.INIT, []);
      });
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  destroy() {
    remove(this._popupComponent);
    remove(this._movieComponent);
  }

  destroyCommenstBlock() {
    if (this._сollectionСommentsPresenter) {
      this._сollectionСommentsPresenter.forEach((presenter) => presenter.destroy());
    }
    if (this._NewCommentPresenter) {
      this._NewCommentPresenter.destroy();
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replacePopupToCard();
    }
  }

  setViewState() {
  }

  _replacePopupToCard() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
    this._body.classList.remove('hidden-scroll');
    this._overlay.classList.remove('active');
    document.removeEventListener('keydown', this._handleEscKeydown);
    this._overlay.removeEventListener('click', this._handleClosePopupClick);
  }

  _replaceCardToPopup() {
    const siteMainElement = document.querySelector('.main');
    render(siteMainElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._changeMode();
    this._mode = Mode.CHANGED;
  }

  _renderComments() {
    this._comment = this._getComments();
    this._containerCommentsListInPopup = this._popupComponent.getElement().querySelector('.film-details__comments-list');
    this._comment.forEach((comment) => {
      let itemPresenter = '';
      itemPresenter = new СommentPresenter(this._containerCommentsListInPopup, this._handleViewAction);
      itemPresenter.init(comment);
      this._сollectionСommentsPresenter.set(comment.id, itemPresenter);
    });

    this._containerNewCommentInPopup = this._popupComponent.getElement().querySelector('.film-details__comments-wrap');
    this._NewCommentPresenter = new NewCommentPresenter(this._containerNewCommentInPopup, this._handleCommentViewAction);
    this._NewCommentPresenter.init();
  }

  _clearComments() {
    this._comment = this._getComments();
    this._comment.forEach((element) => {
      (this._сollectionСommentsPresenter.get(element.id)) ? this._сollectionСommentsPresenter.get(element.id).destroy() : '';
    });
    this._сollectionСommentsPresenter.clear();
    this._NewCommentPresenter.destroy();
  }

  _handleEscKeydown(e) {
    if(e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this._replacePopupToCard();
    }
  }

  _handleOpenPopupClick() {
    this._popupComponent = new MoviePopupView(this._movie);
    this._popupComponent.setCloseClickHandler(this._handleClosePopupClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setHistoryClickHandler(this._handleHistoryClick);

    this._replaceCardToPopup();
    this._getAndRenderComments();
    this._body.classList.add('hidden-scroll');
    this._overlay.classList.add('active');
    document.addEventListener('keydown', this._handleEscKeydown);
    this._overlay.addEventListener('click', this._handleClosePopupClick);
  }

  _handleClosePopupClick() {
    this._replacePopupToCard();
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE_DATA,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        {
          isWatchlist: !this._movie.isWatchlist,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE_DATA,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        {
          isFavorite: !this._movie.isFavorite,
        },
      ),
    );
  }

  _handleHistoryClick() {
    this._changeData(
      UserAction.UPDATE_MOVIE_DATA,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._movie,
        {
          isHistory: !this._movie.isHistory,
        },
      ),
    );
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then((response) => {
            this._commentsModel.deleteComments(updateType, update);
          })
          .then(() => {
            this._api.updateMovie(this._movie)
              .then((response) => {
                this._moviesModel.updateMovie(updateType, response);
                this._changeData(UserAction.UPDATE_MOVIE_DATA, UpdateType.PATCH, response);
              })
              .catch(() => {});
          })
          .catch(() => { });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        //! мб нужен будет при изменении списка комментариев (перерисовать попап и комментарии)
        break;
    }
  }
}
