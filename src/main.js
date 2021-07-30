import {createMenuTemplate} from './view/site-menu.js';
import {createSortingTemplate} from './view/sorting.js';
import {createProfileTemplate} from './view/profile.js';
import {createFilmsContainer} from './view/films-container.js';
import {createMovieCardTemplate} from './view/movie-card.js';

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

const displayMovieCard = (container, function_name, count) => {
  for (let i = 0; i < count; i++) {
    render(container, function_name, 'beforeend');
  }
};

//render(allFilmsElement, createMovieCardTemplate(), 'beforeend');
//render(ratedFilmsElement, createMovieCardTemplate(), 'beforeend');
//render(commentedFilmsElement, createMovieCardTemplate(), 'beforeend');
