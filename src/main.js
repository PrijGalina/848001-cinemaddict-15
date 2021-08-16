import SiteMenuView from './view/site-menu.js';
import {createSortingTemplate} from './view/sorting.js';
import {createProfileTemplate} from './view/profile.js';
import {createFilmsContainer} from './view/films-container.js';
import {createMovieCardTemplate} from './view/movie-view.js';
import {createMovieCounter} from './view/movie-counter.js';
import {createPopupMovieInfo} from './view/popup-movie-info.js';
import { generateMovie, comment} from './mock/movie-mock.js';
import {renderTemplate, renderElement, RenderPosition} from './utils.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const MOVIE_COUNT = 23;
const MOVIE_COUNT_PER_STEP = 5;
const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);

renderTemplate(siteHeaderElement, createProfileTemplate(), 'beforeend');
renderElement(siteMainElement, new SiteMenuView(movies).getElement(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortingTemplate(), 'beforeend');
renderTemplate(siteMainElement, createFilmsContainer(), 'beforeend');

const filmListsContainer = siteMainElement.querySelectorAll('.films-list');
const RATED_FILMS_COUNT = 2;
const COMMENTED_FILMS_COUNT = 2;
const allFilmsElement = filmListsContainer[0].querySelector('.films-list__container');
const ratedFilmsElement = filmListsContainer[1].querySelector('.films-list__container');
const commentedFilmsElement = filmListsContainer[2].querySelector('.films-list__container');


for (let i = 0; i < Math.min(movies.length, MOVIE_COUNT_PER_STEP); i++){
  renderTemplate(allFilmsElement, createMovieCardTemplate(movies[i]), 'beforeend');
}

for (let i = 6; i < (RATED_FILMS_COUNT+6); i++) {
  renderTemplate(ratedFilmsElement, createMovieCardTemplate(movies[i]), 'beforeend');
}
for (let i = 9; i < (9+COMMENTED_FILMS_COUNT); i++) {
  renderTemplate(commentedFilmsElement, createMovieCardTemplate(movies[i]), 'beforeend');
}
const movieCounterElement = document.querySelector('.footer__statistics');
renderTemplate(movieCounterElement, createMovieCounter(), 'beforeend');

const commentsAboutFilm = comment.filter((commentElement) => commentElement.aboutFilm === movies[0].filmId);

renderTemplate(siteMainElement, createPopupMovieInfo(movies[0], commentsAboutFilm), 'beforeend');

const showMoreButton = document.querySelector('.films-list__show-more');

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovies = MOVIE_COUNT_PER_STEP;
  showMoreButton.addEventListener('click', (e) => {
    e.preventDefault();
    movies
      .slice(renderedMovies, renderedMovies +MOVIE_COUNT_PER_STEP)
      .forEach((movie) => { renderTemplate(allFilmsElement, createMovieCardTemplate(movie), 'beforeend');});
    renderedMovies += MOVIE_COUNT_PER_STEP;

    if(renderedMovies >= movies.length){
      showMoreButton.remove();
    }
  });
}
else {
  showMoreButton.classList.add('visually-hidden');
}
