
import MoviePopupView from '../view/popup-movie-info.js';
import MovieCardView from '../view/movie-view';
import {render, RenderPosition, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN',
};

export default class Movie {
  constructor(moviesContainer, commentsAbout, changeMode) {
    this._moviesContainer = moviesContainer; /*   allMovies/ratedMovies/commentedMovies   */
    this._place = moviesContainer.getElement().querySelector('.films-list__container');
    this._movieComponent = null;
    this._movie = null;
    this._commentsAbout = commentsAbout;
    this._popupComponent = null;
    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
  }

  init(movie) {
    this._movie = movie;
    this._movieComponent = new MovieCardView(movie);
    this._movieComponent.setOpenClickHandler(this._handleOpenPopupClick);
    render(this._place, this._movieComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._popupComponent);
  }

  _handleEscKeydown(e) {
    if(e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this._popupComponent.getElement().remove();
      this._popupComponent.removeElement();
      document.removeEventListener('keydown', this._handleEscKeydown);
    }
  }

  _openMoviePopup() {
    const prevPopupComponent = this._popupComponent;
    const siteMainElement = document.querySelector('.main');

    if (prevPopupComponent === null){
      this._popupComponent = new MoviePopupView(this._movie, this._commentsAbout);
      this._popupComponent.setCloseClickHandler(this._handleClosePopupClick);
      render(siteMainElement, this._popupComponent, RenderPosition.BEFOREEND);
      //return;
    }

    this._changeMode();
    this._mode = Mode.OPEN;
    if(prevPopupComponent !== null){
      remove(prevPopupComponent);
    }
  }

  _closeMoviePopup() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _handleOpenPopupClick() {
    //this._mode = Mode.OPEN;
    this._openMoviePopup();
    document.addEventListener('keydown', this._handleEscKeydown);
  }

  _handleClosePopupClick() {
    this._closeMoviePopup();
    document.removeEventListener('keydown', this._handleEscKeydown);
  }

  resetPopup() {
    console.log(this);
    if (this._mode !== Mode.DEFAULT) {
      this._handleClosePopupClick();
    }
  }

}
