import MoviesModel from './model/movies';
import CommentsModel from './model/comments';
import FilterModel from './model/filter.js';
import MoviesListPresenter from './presenter/movies-list';
import FilterPresenter from './presenter/filter';
import ProfileView from './view/profile';
import MovieCounterView from './view/movie-counter';
import {render} from './utils/render';
import {RenderPosition, UpdateType} from './const';
import Api from './api/api';
import {nanoid} from 'nanoid';

const AUTHORIZATION = nanoid(15);

const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const commentsModel = new CommentsModel();

const moviesModel = new MoviesModel();

const filterModel = new FilterModel();


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const moviesPresenter = new MoviesListPresenter(siteMainElement, moviesModel, commentsModel, filterModel, api);
moviesPresenter.init();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView(), RenderPosition.BEFOREEND);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    // ToDo Что то лучше init
    filterPresenter.init();
  })
  .catch (() => {
    moviesModel.setMovies(UpdateType.INIT, []);
  });

export { siteMainElement, moviesPresenter, moviesModel, api};
