import MoviesModel from './model/movies';
import CommentsModel from './model/comments';
import FilterModel from './model/filter.js';
import MoviesListPresenter from './presenter/movies-list';
import FilterPresenter from './presenter/filter';
import ProfileView from './view/profile';
import MovieCounterView from './view/movie-counter';
import {generateMovie} from './mock/movie-mock';
import {generateComment} from './mock/comment';
import {render} from './utils/render';
import {MOVIE_COUNT, COMMENTS_COUNT, RenderPosition} from './const';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const filterModel = new FilterModel();

const moviesPresenter = new MoviesListPresenter(siteMainElement, moviesModel, commentsModel, filterModel);
moviesPresenter.init();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView(), RenderPosition.BEFOREEND);

export {comments, siteMainElement, moviesPresenter, moviesModel};
