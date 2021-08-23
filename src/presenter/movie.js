import MoviesContainerView from '../view/movies-container.js';
import AllMoviesView from '../view/all-movies-block';
import TopRatedView from '../view/rated-movies-block.js';
import MostCommentedView from '../view/commented-movies-block.js';
import MovieCardView from '../view/movie-view';
import NoMovieView from '../view/no-movie';
import SortingView from '../view/sorting';
import {render, RenderPosition} from '../utils/render.js';


const MOVIE_COUNT_PER_STEP = 5;
const RATED_MOVIES_COUNT = 2;
const COMMENTED_MOVIES_COUNT = 2;
const NUMBER_OF_FIRST = 0;

export default class MoviesList{
  constructor(mainContainer) {
    this._mainContainer = mainContainer; //siteMainElement
    this._moviesContainer = new MoviesContainerView();
    this._allMoviesList = new AllMoviesView();
    this._ratedMoviesList = new TopRatedView();
    this._commentedMoviesList = new MostCommentedView();
    this._noMoviesComponent = new NoMovieView();
    this._sortComponent = new SortingView();
    this._sortedByRating = [];
    this._sortedByComments = [];
  }

  init(movieCards) {
    this._movieCards = movieCards.slice();
    render(this._mainContainer, this._moviesContainer, RenderPosition.BEFOREEND);
    this._renderMoviesContainer();
  }

  _renderSort() {
    render(this._mainContainer, this._commentedMoviesList, RenderPosition.BEFOREEND);
  }

  _renderMovie() {
    //отрисует 1 фильм
  }

  _renderMovies(from, to) {
    //вызовывает renderMovie и отрисует весь список

    //all movies
    this.movieCards.slice(from, to)
      .forEach((movie)=> this._renderMovie(movie));
    //rated
    this._sortedByRating = this.movieCards.sort((movieElement, nextElement) => nextElement.rating - movieElement.rating);
    this._sortedByRating.slice(NUMBER_OF_FIRST, RATED_MOVIES_COUNT)
      .forEach((movie)=> this._renderMovie(movie));
    //commented
    this._sortedByComments = this.movieCards.sort((movieElement, nextElement) => nextElement.countComments - movieElement.countComments);
    this._sortedByComments.slice(NUMBER_OF_FIRST, COMMENTED_MOVIES_COUNT)
      .forEach((movie)=> this._renderMovie(movie));
  }

  _renderNoMovies() {
    render(this._mainContainer, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderLoadMoreButton() {

  }

  _renderMoviesContainer(){
    //главный метод, вызывающий все остальные
    if(this.movieCards.length === 0){
      this._renderNoMovies();
      return;
    }

    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._mainContainer, this._allMoviesList, RenderPosition.BEFOREEND);
    render(this._mainContainer, this._ratedMoviesList, RenderPosition.BEFOREEND);

    this._renderMovies(0,  Math.min(this.movieCards.length, MOVIE_COUNT_PER_STEP));
  }
}
