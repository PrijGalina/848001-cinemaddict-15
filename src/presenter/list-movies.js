import MoviesContainerView from '../view/movies-container.js';
import AllMoviesView from '../view/all-movies-block';
import TopRatedView from '../view/rated-movies-block.js';
import MostCommentedView from '../view/commented-movies-block.js';
import NoMovieView from '../view/no-movie';
import SortingView from '../view/sorting';
import ShowMoreButtonView from '../view/show-more-button.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import MoviePresenter from '../presenter/movie.js';


const MOVIE_COUNT_PER_STEP = 5;
const RATED_MOVIES_COUNT = 2;
const COMMENTED_MOVIES_COUNT = 2;
const NUMBER_OF_FIRST = 0;

export default class MoviesList {
  constructor(mainContainer, commentsArray) {
    this._mainContainer = mainContainer; //siteMainElement
    this._commentsArray = commentsArray; //comments about movie

    this._moviePresenter = new Map();
    this._sortedByRating = [];
    this._sortedByComments = [];
    this._commentsAboutFilm = [];
    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;

    this._moviesContainer = new MoviesContainerView();
    this._allMoviesList = new AllMoviesView();
    this._ratedMoviesList = new TopRatedView();
    this._commentedMoviesList = new MostCommentedView();
    this._noMoviesComponent = new NoMovieView();
    this._sortComponent = new SortingView();
    this._showMoreButton = new ShowMoreButtonView();

    this._handlerLoadMoreButtonClick = this._handlerLoadMoreButtonClick.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerMovieChange = this._handlerMovieChange.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    render(this._mainContainer, this._moviesContainer, RenderPosition.BEFOREEND);
    this._renderMoviesContainer();
  }

  _renderNoMovies() {
    render(this._mainContainer, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._moviesContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderCommonList() {
    render(this._moviesContainer, this._allMoviesList, RenderPosition.BEFOREEND);
    this._renderMovies(NUMBER_OF_FIRST,  Math.min(this._movies.length, MOVIE_COUNT_PER_STEP), this._movies, this._allMoviesList);
    (this._movies.length > MOVIE_COUNT_PER_STEP) ? this._renderLoadMoreButton() : '';
  }

  _renderRatedList() {
    render(this._moviesContainer, this._ratedMoviesList, RenderPosition.BEFOREEND);
    this._sortedByRating = this._movies.sort((movieElement, nextElement) => {
      if (movieElement.rating < nextElement.rating) {return 1;}
      else if(movieElement.rating > nextElement.rating) {return -1;}
      else {return 0;}
    });
    this._renderMovies(NUMBER_OF_FIRST,  RATED_MOVIES_COUNT, this._sortedByRating, this._ratedMoviesList);
  }

  _renderCommentedList() {
    render(this._moviesContainer, this._commentedMoviesList, RenderPosition.BEFOREEND);
    this._sortedByComments = this._movies.sort((movieElement, nextElement) => {
      if (movieElement.countComments < nextElement.countComments) {return 1;}
      else if(movieElement.countComments > nextElement.countComments) {return -1;}
      else {return 0;}
    });
    this._renderMovies(NUMBER_OF_FIRST,  COMMENTED_MOVIES_COUNT, this._sortedByComments, this._commentedMoviesList);
  }

  _renderMovies(from, to, array, container) {
    //вызовывает renderMovie и отрисует весь список
    array
      .slice(from, to)
      .forEach((movie)=> this._renderMovie(movie, container));
  }

  _renderLoadMoreButton() {
    render(this._allMoviesList, this._showMoreButton, RenderPosition.BEFOREEND);
    this._showMoreButton.setClickHandler(this._handlerLoadMoreButtonClick);
  }

  _renderMovie(movie, container) {
    //отрисует 1 фильм
    this._commentsAboutFilm = this._commentsArray.filter((commentElement) => commentElement.aboutFilm === movie.filmId);
    const moviePresenter = new MoviePresenter(container, this._commentsAboutFilm, this._handlerMovieChange, this._handlerModeChange);
    moviePresenter.init(movie);
    this._moviePresenter.set(movie.id, moviePresenter);
  }

  _handlerLoadMoreButtonClick() {
    this._movies
      .slice(this._renderedMoviesCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movieItem) => {
        this._renderMovie(movieItem, this._allMoviesList);
      });
    this._renderedMoviesCount += MOVIE_COUNT_PER_STEP;
    (this._renderedMoviesCount >= this._movies.length) ? this._showMoreButton.getElement().remove() : '';
  }

  _handlerModeChange() {
    this._moviePresenter.forEach((presenter) => presenter.resetView());
  }

  _clearMoviesList() {
    this._moviePresenter.forEach((presenter) => presenter.destroy());
    this._moviePresenter.clear();
    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButton);
  }

  _handlerMovieChange(updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);
    this._moviePresenter.get(updatedMovie.id).init(updatedMovie);
  }

  _renderMoviesContainer(){
    //главный метод, вызывающий все остальные
    if(this._movies.length === 0){
      this._renderNoMovies();
      return;
    }
    this._renderSort();
    this._renderCommonList();
    this._renderRatedList();
    this._renderCommentedList();
  }
}
