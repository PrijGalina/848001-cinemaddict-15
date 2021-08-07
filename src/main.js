import {createMenuTemplate} from './view/site-menu.js';
import {createSortingTemplate} from './view/sorting.js';
import {createProfileTemplate} from './view/profile.js';
import {createFilmsContainer} from './view/films-container.js';
import {createMovieCardTemplate} from './view/movie-view.js';
import {createMovieCounter} from './view/movie-counter.js';
import {createPopupMovieInfo} from './view/popup-movie-info.js';
import {COUNT_MOVIES} from './mock/data.js';
import {generateMovie} from './mock/movie-mock.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createFilmsContainer(), 'beforeend');

const filmListsContainer = siteMainElement.querySelectorAll('.films-list');
const ALL_FILMS_COUNT = 5;
const RATED_FILMS_COUNT = 2;
const COMMENTED_FILMS_COUNT = 2;
const allFilmsElement = filmListsContainer[0].querySelector('.films-list__container');
const ratedFilmsElement = filmListsContainer[1].querySelector('.films-list__container');
const commentedFilmsElement = filmListsContainer[2].querySelector('.films-list__container');
const movies = new Array(COUNT_MOVIES).fill().map(generateMovie);

for (let i = 0; i < ALL_FILMS_COUNT; i++){
  render(allFilmsElement, createMovieCardTemplate(movies[i]), 'beforeend');
}
for (let i = 0; i < RATED_FILMS_COUNT; i++) {
  render(ratedFilmsElement, createMovieCardTemplate(movies[i]), 'beforeend');
}
for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
  render(commentedFilmsElement, createMovieCardTemplate(movies[i]), 'beforeend');
}
const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, createMovieCounter(), 'beforeend');

//render(siteMainElement, createPopupMovieInfo(), 'beforeend');
