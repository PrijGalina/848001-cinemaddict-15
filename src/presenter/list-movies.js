import MoviesContainerView from '../view/movies-container.js';
import AllMoviesView from '../view/all-movies-block';
import TopRatedView from '../view/rated-movies-block.js';
import MostCommentedView from '../view/commented-movies-block.js';
import NoMovieView from '../view/no-movie';
import SortingView from '../view/sorting';
import ShowMoreButtonView from '../view/show-more-button.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {updateItem, sortMovieDate, sortMovieRating, sortMovieComments} from '../utils/common.js';
import MoviePresenter from '../presenter/movie.js';
import {SortType} from '../data.js';


const MOVIE_COUNT_PER_STEP = 5;
const RATED_MOVIES_COUNT = 2;
const COMMENTED_MOVIES_COUNT = 2;
const NUMBER_OF_FIRST = 0;

export default class MoviesList {
  constructor(mainContainer, commentsArray) {
    this._mainContainer = mainContainer; //siteMainElement
    this._commentsArray = commentsArray; //comments about movie

    this._allMoviePresenter = new Map();
    this._ratedMoviePresenter = new Map();
    this._commentedMoviePresenter = new Map();
    this._sortedByRating = [];
    this._sortedByComments = [];
    this._commentsAboutFilm = [];
    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._moviesContainer = new MoviesContainerView();
    this._commonMoviesList = new AllMoviesView();
    this._ratedMoviesList = new TopRatedView();
    this._commentedMoviesList = new MostCommentedView();
    this._noMoviesComponent = new NoMovieView();
    this._sortComponent = new SortingView();
    this._showMoreButton = new ShowMoreButtonView();

    this._handlerLoadMoreButtonClick = this._handlerLoadMoreButtonClick.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerMovieChange = this._handlerMovieChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._sourcedMovies = movies.slice();
    render(this._mainContainer, this._moviesContainer, RenderPosition.BEFOREEND);
    this._renderMoviesContainer();
  }

  _renderNoMovies() {
    render(this._mainContainer, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._moviesContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderContainersMovieCategory() {
    render(this._moviesContainer, this._commonMoviesList, RenderPosition.BEFOREEND);
    this._renderCommonList();
    render(this._moviesContainer, this._ratedMoviesList, RenderPosition.BEFOREEND);
    this._renderRatedList();
    render(this._moviesContainer, this._commentedMoviesList, RenderPosition.BEFOREEND);
    this._renderCommentedList();
  }

  _renderCommonList() {
    this._movies
      .slice(NUMBER_OF_FIRST, Math.min(this._movies.length, MOVIE_COUNT_PER_STEP))
      .forEach((movie)=> this._renderCommonMovie(movie, this._commonMoviesList));
    (this._movies.length > MOVIE_COUNT_PER_STEP) ? this._renderLoadMoreButton() : '';
  }

  _renderRatedList() {
    this._sortedByRating = this._movies.sort(sortMovieRating);
    this._sortedByRating
      .slice(NUMBER_OF_FIRST, RATED_MOVIES_COUNT)
      .forEach((movie)=> this._renderRatedMovie(movie, this._ratedMoviesList));
  }

  _renderCommentedList() {
    this._sortedByComments = this._movies.sort(sortMovieComments);
    this._sortedByComments
      .slice(NUMBER_OF_FIRST, COMMENTED_MOVIES_COUNT)
      .forEach((movie)=> this._renderCommentedMovie(movie, this._commentedMoviesList));
  }

  _renderLoadMoreButton() {
    render(this._commonMoviesList, this._showMoreButton, RenderPosition.BEFOREEND);
    this._showMoreButton.setClickHandler(this._handlerLoadMoreButtonClick);
  }

  _renderCommonMovie(movie, container) {
    //отрисует 1 фильм в блок "все фильмы"
    this._commentsAboutFilm = this._commentsArray.filter((commentElement) => commentElement.aboutFilm === movie.filmId);
    const allMoviePresenter = new MoviePresenter(container, this._commentsAboutFilm, this._handlerMovieChange, this._handlerModeChange);
    allMoviePresenter.init(movie);
    this._allMoviePresenter.set(movie.id, allMoviePresenter);
  }

  _renderRatedMovie(movie, container) {
    //отрисует 1 фильм в блок "рейтинговые"
    this._commentsAboutFilm = this._commentsArray.filter((commentElement) => commentElement.aboutFilm === movie.filmId);
    const commentedMoviePresenter = new MoviePresenter(container, this._commentsAboutFilm, this._handlerMovieChange, this._handlerModeChange);
    commentedMoviePresenter.init(movie);
    this._commentedMoviePresenter.set(movie.id, commentedMoviePresenter);
  }

  _renderCommentedMovie(movie, container) {
    //отрисует 1 фильм в блок "комментируемые"
    this._commentsAboutFilm = this._commentsArray.filter((commentElement) => commentElement.aboutFilm === movie.filmId);
    const ratedMoviePresenter = new MoviePresenter(container, this._commentsAboutFilm, this._handlerMovieChange, this._handlerModeChange);
    ratedMoviePresenter.init(movie);
    this._ratedMoviePresenter.set(movie.id, ratedMoviePresenter);
  }

  _handlerLoadMoreButtonClick() {
    this._movies
      .slice(this._renderedMoviesCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movieItem) => {
        this._renderCommonMovie(movieItem, this._commonMoviesList);
      });
    this._renderedMoviesCount += MOVIE_COUNT_PER_STEP;
    (this._renderedMoviesCount >= this._movies.length) ? this._showMoreButton.getElement().remove() : '';
  }

  _handlerModeChange() {
    this._allMoviePresente !== undefined ? this._allMoviePresenter.forEach((presenter) => presenter.resetView()) : '';
    this._ratedMoviePresenter !== undefined ? this._ratedMoviePresenter.forEach((presenter) => presenter.resetView()): '';
    this._commentedoviePresenter !== undefined ? this._commentedoviePresenter.forEach((presenter) => presenter.resetView()) : '';
  }

  _clearCommonList() {
    this._allMoviePresenter.forEach((presenter) => {
      presenter.destroy();
    });
    this._allMoviePresenter.clear();
    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButton);
  }

  _handlerMovieChange(updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);
    this._sourcedMovies = updateItem(this._sourcedMovies, updatedMovie);

    if(this._allMoviePresenter.has(updatedMovie.id)) {
      this._allMoviePresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if(this._ratedMoviePresenter.has(updatedMovie.id)){
      this._ratedMoviePresenter.get(updatedMovie.id).init(updatedMovie);
    }
    if(this._commentedMoviePresenter.has(updatedMovie.id)){
      this._commentedMoviePresenter.get(updatedMovie.id).init(updatedMovie);
    }
  }

  _sortMovies(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._movies.sort(sortMovieDate);
        break;
      case SortType.BY_RATING:
        this._movies.sort(sortMovieRating);
        break;
      default:
        this._movies = this._sourcedMovies.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    //sorting
    if(this._currentSortType === sortType) {
      return;
    }

    this._sortMovies(sortType);
    //clean
    this._clearCommonList();

    //render
    this._renderCommonList();
  }

  _renderMoviesContainer(){
    //главный метод, вызывающий все остальные
    if(this._movies.length === 0){
      this._renderNoMovies();
      return;
    }
    this._renderSort();
    this._renderContainersMovieCategory();
  }
}
