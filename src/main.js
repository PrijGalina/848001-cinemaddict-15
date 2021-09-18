import ProfileView from './view/profile';
import MovieCounterView from './view/movie-counter';
import {generateMovie} from './mock/movie-mock';
import {render} from './utils/render';
import { MOVIE_COUNT, COMMENTS_COUNT, RenderPosition} from './const';
import MoviesListPresenter from './presenter/list-movies';
import {generateComment} from './mock/comment';
import MoviesModel from './model/movies';
import CommentsModel from './model/comments';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const moviesPresenter = new MoviesListPresenter(siteMainElement, moviesModel, commentsModel);
moviesPresenter.init();

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView(), RenderPosition.BEFOREEND);

export {comments, siteMainElement};
