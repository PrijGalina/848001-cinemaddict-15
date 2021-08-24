import MoviesContainerView from '../view/movies-container.js';
import AllMoviesView from '../view/all-movies-block';
import TopRatedView from '../view/rated-movies-block.js';
import MostCommentedView from '../view/commented-movies-block.js';
import MovieCardView from '../view/movie-view';
import NoMovieView from '../view/no-movie';
import SortingView from '../view/sorting';
import ShowMoreButtonView from '../view/show-more-button.js';
import {render, RenderPosition} from '../utils/render.js';


const MOVIE_COUNT_PER_STEP = 5;
const RATED_MOVIES_COUNT = 2;
const COMMENTED_MOVIES_COUNT = 2;
const NUMBER_OF_FIRST = 0;

export default class MoviesList {
  constructor(mainContainer) {
    this._mainContainer = mainContainer; //siteMainElement
    this._moviesContainer = new MoviesContainerView();
    this._allMoviesList = new AllMoviesView();
    this._ratedMoviesList = new TopRatedView();
    this._commentedMoviesList = new MostCommentedView();
    this._noMoviesComponent = new NoMovieView();
    this._sortComponent = new SortingView();
    this._showMoreButton = new ShowMoreButtonView();
    this._sortedByRating = [];
    this._sortedByComments = [];
    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    this._handlerLoadMoreButtonClick = this._handlerLoadMoreButtonClick.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    render(this._mainContainer, this._moviesContainer, RenderPosition.BEFOREEND);
    this._renderMoviesContainer();
  }

  _renderSort() {
    render(this._mainContainer, this._commentedMoviesList, RenderPosition.BEFOREEND);
  }

  _renderMovie(movie, container) {
    //отрисует 1 фильм
    const place = container.getElement().querySelector('.films-list__container');
    const movieCard = new MovieCardView(movie);
    render(place, movieCard, RenderPosition.BEFOREEND);
  }

  _renderMovies(from, to, array, container) {
    //вызовывает renderMovie и отрисует весь список
    array
      .slice(from, to)
      .forEach((movie)=> this._renderMovie(movie, container));
  }

  _renderNoMovies() {
    render(this._mainContainer, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _handlerLoadMoreButtonClick() {
    const place = this._allMoviesList.getElement().querySelector('.films-list__container');
    this._movies
      .slice(this._renderedMoviesCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movieItem) => {render(place, new MovieCardView(movieItem), RenderPosition.BEFOREEND);});
    this._renderedMoviesCount += MOVIE_COUNT_PER_STEP;
    (this._renderedMoviesCount >= this._movies.length) ? this._showMoreButton.getElement().remove() : '';
  }

  _renderLoadMoreButton() {
    render(this._allMoviesList, this._showMoreButton, RenderPosition.BEFOREEND);
    this._showMoreButton.setClickHandler(this._handlerLoadMoreButtonClick);
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
