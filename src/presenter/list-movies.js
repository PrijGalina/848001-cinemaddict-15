import MoviePresenter from '../presenter/movie';
import MoviesContainerView from '../view/movies-container';
import NoMovieView from '../view/no-movie';
import AllMoviesView from '../view/all-movies-block';
import TopRatedView from '../view/rated-movies-block';
import MostCommentedView from '../view/commented-movies-block';
import SortingView from '../view/sorting';
import ShowMoreButtonView from '../view/show-more-button';
import {filter} from '../utils/filter';
import {remove, render} from '../utils/render';
import {sortMovieDate, sortMovieRating, sortMovieComments} from '../utils/common';
import {SortType, MoviesListType, RenderPosition, UserAction, UpdateType, MOVIE_COUNT_PER_STEP, NUMBER_OF_FIRST} from '../const';

export default class MoviesList {
  constructor(mainContainer, moviesModel, commentsModel, filterModel) {
    this._mainContainer = mainContainer;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._moviePresenter = new Map();
    this._ratingMoviePresenter = new Map();
    this._commentedMoviePresenter = new Map();

    this._moviesComponent = new MoviesContainerView();
    this._allMoviesSectionComponent = new AllMoviesView();
    this._ratedMoviesSectionComponent = new TopRatedView();
    this._commentedMoviesSectionComponent = new MostCommentedView();
    this._noMoviesComponent = null;
    this._showMoreButtonComponent = null;
    this._filterComponent = null;
    this._sortComponent = null;

    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);

    this._handlerLoadMoreButtonClick = this._handlerLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._mainContainer, this._moviesComponent, RenderPosition.BEFOREEND);
    this._renderMovieList();
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filtredMovies.sort(sortMovieDate);
      case SortType.BY_RATING:
        return filtredMovies.sort(sortMovieRating);
      case SortType.BY_COMMENTS_COUNT:
        return filtredMovies.sort(sortMovieComments);
    }

    return filtredMovies;
  }

  _renderNoMovies() {
    const filterType = this._filterModel.getFilter();
    this._noMoviesComponent = new NoMovieView(filterType);
    render(this._mainContainer, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    (this._sortComponent !== null) ? this._sortComponent = null : '';
    this._sortComponent = new SortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._moviesComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderLoadMoreButton() {
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handlerLoadMoreButtonClick);
    render(this._allMoviesSectionComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _handlerLoadMoreButtonClick() {
    const movieCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(movieCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMoviesCount, newRenderedMoviesCount);

    this._renderMovieListByType(movies, MoviesListType.ALL);

    this._renderedMoviesCount = newRenderedMoviesCount;
    (this._renderedMoviesCount >= movieCount) ? this._showMoreButtonComponent.getElement().remove() : '';
  }

  _handlerModeChange() {
    this._moviePresenter !== undefined ? this._moviePresenter.forEach((presenter) => presenter.resetView()) : '';
    this._ratingMoviePresenter !== undefined ? this._ratingMoviePresenter.forEach((presenter) => presenter.resetView()) : '';
    this._commentedMoviePresenter !== undefined ? this._commentedMoviePresenter.forEach((presenter) => presenter.resetView()) : '';
  }

  _handleSortTypeChange(sortType) {
    //sorting
    if(this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    //clean
    this._clearMovieList();

    //render
    this._renderMovieList();
  }

  _handleFilterChange(){
    //console.log('FilterChange');
  }

  _renderMovieListByType(array, type) {
    const canShowMore = this._getMovies().length > this._renderedMoviesCount;
    const alreadyExistsButton = (this._showMoreButtonComponent !== null);
    let moviePresenter = null;
    switch(type){
      case MoviesListType.ALL:
        array.forEach((movie) => {
          const container = this._allMoviesSectionComponent;
          moviePresenter = new MoviePresenter(container, this._commentsModel, this._handleViewAction, this._handlerModeChange);
          moviePresenter.init(movie);
          this._moviePresenter.set(movie.id, moviePresenter);
        });
        (canShowMore && !alreadyExistsButton) ? this._renderLoadMoreButton() : '';
        break;
      case MoviesListType.RATED:
        array.forEach((movie) => {
          const container = this._ratedMoviesSectionComponent;
          moviePresenter = new MoviePresenter(container, this._commentsModel, this._handleViewAction, this._handlerModeChange);
          moviePresenter.init(movie);
          this._ratingMoviePresenter.set(movie.id, moviePresenter);
        });
        break;
      case MoviesListType.COMMENTED:
        array.forEach((movie) => {
          const container = this._commentedMoviesSectionComponent;
          moviePresenter = new MoviePresenter(container, this._commentsModel, this._handleViewAction, this._handlerModeChange);
          moviePresenter.init(movie);
          this._commentedMoviePresenter.set(movie.id, moviePresenter);
        });
        break;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE_DATA:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.UPDATE_MOVIE_VIEW:
        this._moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        // - обновить элемент
        (this._moviePresenter.get(data.id)) ? this._moviePresenter.get(data.id).init(data) : '';
        (this._ratingMoviePresenter.get(data.id)) ? this._ratingMoviePresenter.get(data.id).init(data) : '';
        (this._commentedMoviePresenter.get(data.id)) ? this._commentedMoviePresenter.get(data.id).init(data) : '';
        break;
      case UpdateType.MINOR:
        // - обновить список
        this._clearMovieList();
        this._renderMovieList();
        break;
      case UpdateType.MAJOR:
        // - обновить все (меню, список)
        this._clearMovieList({resetRenderedMovieCount: true, resetSortType: true});
        this._renderMovieList();
        break;
    }
  }

  _clearMovieList({ resetRenderedMovieCount = false, resetSortType = false } = {}) {
    const movieCount = this._getMovies().length;
    this._moviePresenter.forEach((presenter) => presenter.destroy());
    this._commentedMoviePresenter.forEach((presenter) => presenter.destroy());
    this._ratingMoviePresenter.forEach((presenter) => presenter.destroy());
    this._moviePresenter.clear();
    this._commentedMoviePresenter.clear();
    this._ratingMoviePresenter.clear();

    remove(this._sortComponent);
    (this._noMoviesComponent) ? remove(this._noMoviesComponent) : '';
    (this._showMoreButtonComponent) ?  remove(this._showMoreButtonComponent) : '';
    remove(this._allMoviesSectionComponent);
    remove(this._ratedMoviesSectionComponent);
    remove(this._commentedMoviesSectionComponent);

    this._showMoreButtonComponent = null;

    (resetRenderedMovieCount) ? this._renderedMoviesCount = MOVIE_COUNT_PER_STEP : this._renderedMoviesCount = Math.min(movieCount, this._renderedMoviesCount);
    (resetSortType) ? this._currentSortType = SortType.DEFAULT : '';
  }

  _renderMovieList() {
    const movies = this._getMovies();
    const movieCount = movies.length;

    if (movieCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();

    render(this._moviesComponent, this._allMoviesSectionComponent, RenderPosition.BEFOREEND);
    render(this._moviesComponent, this._ratedMoviesSectionComponent, RenderPosition.BEFOREEND);
    render(this._moviesComponent, this._commentedMoviesSectionComponent, RenderPosition.BEFOREEND);

    const listOfAllMovies = movies.slice(NUMBER_OF_FIRST, this._renderedMoviesCount);
    const listOfRatedMovies = movies.slice().sort(sortMovieRating).slice(NUMBER_OF_FIRST, MoviesListType.COMMENTED.movieCount);
    const listOfCommentedMovies = movies.slice().sort(sortMovieComments).slice(NUMBER_OF_FIRST, MoviesListType.COMMENTED.movieCount);

    this._renderMovieListByType(listOfAllMovies, MoviesListType.ALL);
    this._renderMovieListByType(listOfRatedMovies, MoviesListType.RATED);
    this._renderMovieListByType(listOfCommentedMovies, MoviesListType.COMMENTED);
  }
}
