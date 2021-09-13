import SiteMenuView from './view/site-menu.js';
import ProfileView from './view/profile.js';
import MovieCounterView from './view/movie-counter.js';
import {generateMovie} from './mock/movie-mock.js';
import {render, RenderPosition} from './utils/render.js';
import {MOVIE_COUNT, COMMENTS_COUNT} from './data.js';
import MoviesListPresenter from './presenter/list-movies.js';
import {generateComment} from './mock/comment.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(movies), RenderPosition.BEFOREEND);

const moviesPresenter = new MoviesListPresenter(siteMainElement);
moviesPresenter.init(movies);

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView(), RenderPosition.BEFOREEND);

export {comments};
