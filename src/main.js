import SiteMenuView from './view/site-menu.js';
import SortingView from './view/sorting.js';
import ProfileView from './view/profile.js';
import MoviesContainerView from './view/movies-container.js';
import AllMoviesView from './view/all-movies-block.js';
import TopRatedView from './view/rated-movies-block.js';
import MostCommentedView from './view/commented-movies-block.js';
import MovieCardView from './view/movie-view.js';
import MovieCounterView from './view/movie-counter.js';
import MoviePopupView from './view/popup-movie-info.js';
import NoMovieView from './view/no-movie.js';
import {generateMovie, comment} from './mock/movie-mock.js';
import {render, RenderPosition} from './utils/render.js';
import {MOVIE_COUNT, MOVIE_COUNT_PER_STEP, RATED_FILMS_COUNT, COMMENTED_FILMS_COUNT} from './data.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(movies), RenderPosition.BEFOREEND);

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

  if (movies.length > MOVIE_COUNT_PER_STEP) {
    let renderedMovies = MOVIE_COUNT_PER_STEP;
    showMoreButton.addEventListener('click', (e) => {
      e.preventDefault();
      movies
        .slice(renderedMovies, renderedMovies + MOVIE_COUNT_PER_STEP)
        .forEach((movieItem) => {render(place, new MovieCardView(movieItem), RenderPosition.BEFOREEND);});
      renderedMovies += MOVIE_COUNT_PER_STEP;
      (renderedMovies >= movies.length) ? showMoreButton.remove() : '';
    });
  }
  else {
    showMoreButton.classList.add('visually-hidden');
  }
};

if(MOVIE_COUNT === 0){
  render(siteMainElement, new NoMovieView(), RenderPosition.BEFOREEND);
}
else {
  render(siteMainElement, new SortingView(), RenderPosition.BEFOREEND);
  render(siteMainElement, new MoviesContainerView(), RenderPosition.BEFOREEND);

  const filmListsContainer = siteMainElement.querySelector('.films');
  render(filmListsContainer, new AllMoviesView(), RenderPosition.BEFOREEND);
  const allFilmsElement = filmListsContainer.querySelector('.films-list--all .films-list__container');
  for(let i = 0; i < MOVIE_COUNT_PER_STEP; i++) {
    if (i <  Math.min(movies.length, MOVIE_COUNT_PER_STEP)) {
      renderMovie(movies[i], allFilmsElement);
    }
  }
  render(filmListsContainer, new TopRatedView(), RenderPosition.BEFOREEND);
  const ratedFilmsElement = filmListsContainer.querySelector('.films-list--rated .films-list__container');
  for(let i = 0; i < RATED_FILMS_COUNT; i++) {
    renderMovie(movies[i], ratedFilmsElement);
  }
  render(filmListsContainer, new MostCommentedView(), RenderPosition.BEFOREEND);
  const commentedFilmsElement = filmListsContainer.querySelector('.films-list--commented .films-list__container');
  for(let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
    renderMovie(movies[i], commentedFilmsElement);
  }
}

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView(), RenderPosition.BEFOREEND);
