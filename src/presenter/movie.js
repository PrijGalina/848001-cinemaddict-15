
import СommentsListPresenter from './comments-list';
import MoviePopupView from '../view/popup-movie-info';
import MovieCardView from '../view/movie-view';
import {render, remove, replace} from '../utils/render';
import {RenderPosition, Mode, UserAction, UpdateType} from './../const';

export default class Movie {
  constructor(moviesContainer, commentsModel, changeData, changeMode, api) {
    this._api = api;
    this._moviesContainer = moviesContainer;
    this._commentsModel = commentsModel;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._movieComponent = null;
    this._popupComponent = null;

    this._commentsListPresenter = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handlerMovieUpdate = this._handlerMovieUpdate.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;
    this._containerForMovie = this._moviesContainer.getElement().querySelector('.films-list__container');

    this._movieComponent = new MovieCardView(this._movie);
    this._movieComponent.setOpenClickHandler(this._handleOpenPopupClick);
    this._movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setHistoryClickHandler(this._handleHistoryClick);

    this._popupComponent = new MoviePopupView(this._movie);
    this._popupComponent.setCloseClickHandler(this._handleClosePopupClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setHistoryClickHandler(this._handleHistoryClick);

    if (prevMovieComponent === null || prevPopupComponent === null){
      render(this._containerForMovie, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._movieComponent, prevMovieComponent);
    replace(this._popupComponent, prevPopupComponent);

    remove(prevMovieComponent);
    remove(prevPopupComponent);
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  destroy() {
    remove(this._popupComponent);
    remove(this._movieComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replacePopupToCard();
    }
  }

  _commentsBlockInit() {
    this._commentsBlockContainer = this._popupComponent.getElement().querySelector('.film-details__comments-list');
    this._commentsListPresenter = new СommentsListPresenter(this._commentsBlockContainer, this._commentsModel, this._handlerMovieUpdate);
    this._commentsListPresenter.init();
  }

  _replacePopupToCard() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToPopup() {
    const siteMainElement = document.querySelector('.main');
    render(siteMainElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._changeMode();
    this._mode = Mode.CHANGED;
    //this._changeData(Object.assign({},this._movie));
  }

  _handleEscKeydown(e) {
    if(e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this._replacePopupToCard();
      document.removeEventListener('keydown', this._handleEscKeydown);
      document.querySelector('body').classList.remove('hidden-scroll');
    }
  }

  _handleOpenPopupClick() {
    const openPopup = document.querySelector('.film-details');
    if (openPopup) {
      openPopup.remove();
    }
    this._replaceCardToPopup();
    document.addEventListener('keydown', this._handleEscKeydown);
    document.querySelector('body').classList.add('hidden-scroll');

    this._api.getComments(this._movie)
      .then((comments) => {
        this._commentsModel.setComments(UpdateType.INIT, comments);
      })
      .catch(() => {
        this._commentsModel.setComments(UpdateType.INIT, []);
      });
    this._commentsBlockInit();
  }

  _handleClosePopupClick() {
    this._replacePopupToCard();
    document.removeEventListener('keydown', this._handleEscKeydown);
    document.querySelector('body').classList.remove('hidden-scroll');
  }

  _handleWatchlistClick() {
    if (this._mode === Mode.DEFAULT) {
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
    else {
      this._changeData(
        UserAction.UPDATE_MOVIE_DATA,
        UpdateType.PATCH,
        Object.assign(
          {},
          this._movie,
          {
            isWatchlist: !this._movie.isWatchlist,
          },
        ),
      );
    }
  }

  _handleFavoriteClick() {
    if (this._mode === Mode.DEFAULT) {
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
    } else {
      this._changeData(
        UserAction.UPDATE_MOVIE_DATA,
        UpdateType.PATCH,
        Object.assign(
          {},
          this._movie,
          {
            isFavorite: !this._movie.isFavorite,
          },
        ),
      );
    }
  }

  _handleHistoryClick() {
    if (this._mode === Mode.DEFAULT) {
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
    else {
      this._changeData(
        UserAction.UPDATE_MOVIE_DATA,
        UpdateType.PATCH,
        Object.assign(
          {},
          this._movie,
          {
            isHistory: !this._movie.isHistory,
          },
        ),
      );
    }
  }

  _handlerMovieUpdate(commentsListUpdate) {
    const comments = [commentsListUpdate][0].map((comment) => comment.id);
    this._changeData(
      UserAction.UPDATE_MOVIE_DATA,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._movie,
        {
          comments: comments,
        },
      ),
    );
  }
}
