import {commentsArray} from '../mock/movie-mock.js';
import MoviePopupView from '../view/popup-movie-info.js';
import MovieCardView from '../view/movie-view';
/*
const renderMovie = (movie, place) => {
  const commentsAboutFilm = comment.filter((commentElement) => commentElement.aboutFilm === movie.filmId);
  const movieCard = new MovieCardView(movie);
  const popup = new MoviePopupView(movie, commentsAboutFilm);
  const showMoreButton = document.querySelector('.films-list__show-more');
  render(place, movieCard, RenderPosition.BEFOREEND);

  const onEscKeyDown = (e) => {
    if(e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      popup.getElement().remove();
      popup.removeElement();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const openMoviePopup = () => {
    render(siteMainElement, popup, RenderPosition.BEFOREEND);
  };

  const closeMoviePopup = () => {
    popup.getElement().remove();
    popup.removeElement();
  };

  movieCard.setOpenClickHandler(() => {
    openMoviePopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  popup.setCloseClickHandler(() => {
    closeMoviePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });


};
*/
export default class Movie {
  constructor(moviesContainer) {
    this._moviesContainer = moviesContainer; /*   allMovies/ratedMovies/commentedMovies   */
    //new MovieCardView()
  }
}
