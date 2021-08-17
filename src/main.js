import SiteMenuView from './view/site-menu.js';
import SortingView from './view/sorting.js';
import ProfileView from './view/profile.js';
import FilmContainerView from './view/films-container.js';
import MovieCardView from './view/movie-view.js';
import MovieCounterView from './view/movie-counter.js';
import MoviePopupView from './view/popup-movie-info.js';
import {generateMovie, comment} from './mock/movie-mock.js';
import {render, RenderPosition} from './utils.js';
import {MOVIE_COUNT, MOVIE_COUNT_PER_STEP, RATED_FILMS_COUNT, COMMENTED_FILMS_COUNT} from './data.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const movieCount = Math.min(movies.length, MOVIE_COUNT_PER_STEP) + RATED_FILMS_COUNT + COMMENTED_FILMS_COUNT;

render(siteHeaderElement, new ProfileView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(movies).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmContainerView().getElement(), RenderPosition.BEFOREEND);

const filmListsContainer = siteMainElement.querySelectorAll('.films-list');
const allFilmsElement = filmListsContainer[0].querySelector('.films-list__container');
const ratedFilmsElement = filmListsContainer[1].querySelector('.films-list__container');
const commentedFilmsElement = filmListsContainer[2].querySelector('.films-list__container');
const showMoreButton = document.querySelector('.films-list__show-more');

for (let i = 0; i < movieCount; i++){
  if (i <  Math.min(movies.length, MOVIE_COUNT_PER_STEP)) {
    render(allFilmsElement, new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
  }
  else if (i < movieCount-RATED_FILMS_COUNT){
    render(ratedFilmsElement, new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
  }
  else {
    render(commentedFilmsElement, new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
  }
}

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView().getElement(), RenderPosition.BEFOREEND);

const commentsAboutFilm = comment.filter((commentElement) => commentElement.aboutFilm === movies[0].filmId);
render(siteMainElement, new MoviePopupView(movies[0], commentsAboutFilm).getElement(), RenderPosition.BEFOREEND);

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovies = MOVIE_COUNT_PER_STEP;
  showMoreButton.addEventListener('click', (e) => {
    e.preventDefault();
    movies
      .slice(renderedMovies, renderedMovies + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => {render(allFilmsElement, new MovieCardView(movie).getElement(), RenderPosition.BEFOREEND);});
    renderedMovies += MOVIE_COUNT_PER_STEP;
    (renderedMovies >= movies.length) ? showMoreButton.remove() : '';
  });
}
else {
  showMoreButton.classList.add('visually-hidden');
}
