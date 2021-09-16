
import MoviePopupView from '../view/popup-movie-info.js';
import MovieCardView from '../view/movie-view';
import {render, remove, replace} from '../utils/render.js';
import СommentsListPresenter from './list-comments';
import {deleteItem} from '../utils/common.js';
import {RenderPosition} from './../data.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  CHANGED: 'CHANGED',
};

export default class Movie {
  constructor(moviesContainer, commentsAbout, changeData, changeMode, changeCommentsList) {
    this._moviesContainer = moviesContainer;
    this._commentsAbout = commentsAbout;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._changeCommentsList = changeCommentsList;
    this._movieComponent = null;
    this._movie = null;
    this._popupComponent = null;
    this._commentsListPresenter = null;
    this._mode = Mode.DEFAULT;
    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._commentsPlace = null;
    this._container = document.querySelector('.film-details__inner');
    this._handlerCommentListChange = this._handlerCommentListChange.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;
    this._movieComponent = new MovieCardView(this._movie);
    this._movieComponent.setOpenClickHandler(this._handleOpenPopupClick);
    this._movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setHistoryClickHandler(this._handleHistoryClick);

    this._popupComponent = new MoviePopupView(this._movie);
    this._popupComponent.setCloseClickHandler(this._handleClosePopupClick);
    this._popupComponent.setFavoriteClickPopupHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchlistClickPopupHandler(this._handleWatchlistClick);
    this._popupComponent.setHistoryClickPopupHandler(this._handleHistoryClick);

    if(prevMovieComponent === null){
      this._place = this._moviesContainer.getElement().querySelector('.films-list__container');
      render(this._place, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._movieComponent, prevMovieComponent);
    replace(this._popupComponent, prevPopupComponent);
    remove(prevMovieComponent);
    remove(prevPopupComponent);
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

  _commentsListInit() {
    this._commentsListPresenter = new СommentsListPresenter(this._handlerCommentListChange);
    this._commentsListPresenter.init(this._commentsAbout);
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
    this._changeData(Object.assign({},this._movie));
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
    this._commentsListInit();
  }

  _handleClosePopupClick() {
    this._replacePopupToCard();
    document.removeEventListener('keydown', this._handleEscKeydown);
    document.querySelector('body').classList.remove('hidden-scroll');
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          isWatchlist: !this._movie.isWatchlist,
        },
      ),
    );
    this._commentsListInit();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          isFavorite: !this._movie.isFavorite,
        },
      ),
    );
    this._commentsListInit();
  }

  _handleHistoryClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          isHistory: !this._movie.isHistory,
        },
      ),
    );
    this._commentsListInit();
  }

  _handlerCommentListChange(updatedComment) {
    this._commentsAbout = deleteItem(this._commentsAbout, updatedComment);
    this._commentsListPresenter.init(this._commentsAbout);
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          comments: this._commentsAbout,
        },
      ),
    );
    this._commentsListInit();
  }
}
