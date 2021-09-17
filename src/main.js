import ProfileView from './view/profile';
import MovieCounterView from './view/movie-counter';
import {generateMovie} from './mock/movie-mock';
import {render} from './utils/render';
import { MOVIE_COUNT, COMMENTS_COUNT, RenderPosition} from './data';
import MoviesListPresenter from './presenter/list-movies';
import {generateComment} from './mock/comment';


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);

render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const moviesPresenter = new MoviesListPresenter(siteMainElement);
moviesPresenter.init(movies, comments);

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView(), RenderPosition.BEFOREEND);

export {comments, siteMainElement};
