
import MoviePopupView from '../view/popup-movie-info.js';
import MovieCardView from '../view/movie-view';
import {render, RenderPosition, remove, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  CHANGED: 'CHANGED',
};

export default class Movie {
  constructor(moviesContainer, commentsAbout, changeData, changeMode) {
    this._moviesContainer = moviesContainer;
    this._commentsAbout = commentsAbout;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._movieComponent = null;
    this._movie = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

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
    const prevPopupComponent = this._popupComponent;

    this._movieComponent = new MovieCardView(movie);
    this._movieComponent.setOpenClickHandler(this._handleOpenPopupClick);
    this._movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setHistoryClickHandler(this._handleHistoryClick);

    this._popupComponent = new MoviePopupView(this._movie, this._commentsAbout);
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

  _replacePopupToCard() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToPopup() {
    const siteMainElement = document.querySelector('.main');
    render(siteMainElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._changeMode();
    this._mode = Mode.CHANGED;
  }

  _handleEscKeydown(e) {
    if(e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this._replacePopupToCard();
      document.removeEventListener('keydown', this._handleEscKeydown);
    }
  }

  _handleOpenPopupClick() {
    this._replaceCardToPopup();
    document.addEventListener('keydown', this._handleEscKeydown);
  }

  _handleClosePopupClick() {
    this._replacePopupToCard();
    document.removeEventListener('keydown', this._handleEscKeydown);
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
  }
}
