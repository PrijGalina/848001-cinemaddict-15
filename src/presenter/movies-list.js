import MoviePresenter from './movie';
import MoviesContainerView from '../view/movies-container';
import NoMovieView from '../view/no-movie';
import AllMoviesBlock from '../view/all-movies-block';
import TopRatedView from '../view/top-rated';
import MostCommentedView from '../view/most-commented';
import SortingView from '../view/sorting';
import ShowMoreButtonView from '../view/show-more-button';
import LoadingView from '../view/loading';
import MoviePopupView from '../view/movie-popup';
import {filter} from '../utils/filter';
import {remove, render, replace} from '../utils/render';
import {sortMovieDate, sortMovieRating, sortMovieComments} from '../utils/common';
import {SortType, MoviesListType, RenderPosition, UserAction, UpdateType, MOVIE_COUNT_PER_STEP, NUMBER_OF_FIRST} from '../const';

export default class MoviesList {
  constructor(mainContainer, moviesModel, commentsModel, filterModel, api) {
    this._isLoading = true;
    this._api = api;
    this._mainContainer = mainContainer;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._moviePresenter = new Map();
    this._ratingMoviePresenter = new Map();
    this._commentedMoviePresenter = new Map();
    this._instanceAllMovie = null;
    this._instanceRatingMovie = null;
    this._instanceCommentedMovie = null;
    this._currentPopupComponent = null;

    this._moviesComponent = new MoviesContainerView();
    this._allMoviesSectionComponent = new AllMoviesBlock();
    this._ratedMoviesSectionComponent = new TopRatedView();
    this._commentedMoviesSectionComponent = new MostCommentedView();
    this._loadingComponent = new LoadingView();
    this._noMoviesComponent = null;
    this._showMoreButtonComponent = null;
    this._filterComponent = null;
    this._sortComponent = null;

    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._handlerLoadMoreButtonClick = this._handlerLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._mainContainer, this._moviesComponent, RenderPosition.BEFOREEND);
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderMovieList();
  }

  destroy() {
    this._clearMovieList();
    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
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

  _renderLoading() {
    render(this._moviesComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovieList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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

  _clearMovieList({resetSortType = false } = {}) {
    this._moviePresenter.forEach((presenter) => presenter.destroy());
    this._commentedMoviePresenter.forEach((presenter) => presenter.destroy());
    this._ratingMoviePresenter.forEach((presenter) => presenter.destroy());
    this._moviePresenter.clear();
    this._commentedMoviePresenter.clear();
    this._ratingMoviePresenter.clear();

    remove(this._sortComponent);
    remove(this._loadingComponent);
    (this._noMoviesComponent) ? remove(this._noMoviesComponent) : '';
    (this._showMoreButtonComponent) ? remove(this._showMoreButtonComponent) : '';
    remove(this._allMoviesSectionComponent);
    remove(this._ratedMoviesSectionComponent);
    remove(this._commentedMoviesSectionComponent);

    this._showMoreButtonComponent = null;
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    (resetSortType) ? this._currentSortType = SortType.DEFAULT : '';
  }

  _renderMovieListByType(array, type) {
    const canShowMore = this._getMovies().length > this._renderedMoviesCount;
    const alreadyExistsButton = (this._showMoreButtonComponent !== null);
    let moviePresenter = null;
    switch (type) {
      case MoviesListType.ALL:
        array.forEach((movie) => {
          const container = this._allMoviesSectionComponent;
          moviePresenter = new MoviePresenter(container, this._moviesModel, this._commentsModel, this._api,  this._handleViewAction, this._handlerModeChange);
          moviePresenter.init(movie);
          this._moviePresenter.set(movie.id, moviePresenter);
        });
        (canShowMore && !alreadyExistsButton) ? this._renderLoadMoreButton() : '';
        break;
      case MoviesListType.RATED:
        array.forEach((movie) => {
          const container = this._ratedMoviesSectionComponent;
          moviePresenter = new MoviePresenter(container, this._moviesModel, this._commentsModel, this._api,  this._handleViewAction, this._handlerModeChange);
          moviePresenter.init(movie);
          this._ratingMoviePresenter.set(movie.id, moviePresenter);
        });
        break;
      case MoviesListType.COMMENTED:
        array.forEach((movie) => {
          const container = this._commentedMoviesSectionComponent;
          moviePresenter = new MoviePresenter(container, this._moviesModel, this._commentsModel, this._api,  this._handleViewAction, this._handlerModeChange);
          moviePresenter.init(movie);
          this._commentedMoviePresenter.set(movie.id, moviePresenter);
        });
        break;
    }
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
    if(this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMovieList();
    this._renderMovieList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE_DATA:
        this._instanceAllMovie = (this._moviePresenter.get(update.id)) ? this._moviePresenter.get(update.id) : null;
        this._instanceRatingMovie = (this._ratingMoviePresenter.get(update.id)) ? this._ratingMoviePresenter.get(update.id) : null;
        this._instanceCommentedMovie = (this._commentedMoviePresenter.get(update.id)) ? this._commentedMoviePresenter.get(update.id) : null;
        this._api.updateMovie(update)
          .then((response) => {
            this._moviesModel.updateMovie(updateType, response);
          })
          .catch(() => {});
        break;
      case UserAction.DELETE_COMMENT:
        this._api.updateMovie(update)
          .then((response) => {
            this._moviesModel.updateMovie(updateType, response);
          })
          .catch(() => { });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        (this._moviePresenter.get(data.id)) ? this._moviePresenter.get(data.id).init(data) : '';
        (this._ratingMoviePresenter.get(data.id)) ? this._ratingMoviePresenter.get(data.id).init(data) : '';
        (this._commentedMoviePresenter.get(data.id)) ? this._commentedMoviePresenter.get(data.id).init(data) : '';
        break;
      case UpdateType.MINOR:
        if(this._instanceAllMovie !== null) {

          this._moviePresenter.get(data.id).init(data);

          if (this._instanceAllMovie._popupComponent !== null) {
            const prevPopup = this._instanceAllMovie._popupComponent;
            this._currentPopupComponent = this._instanceAllMovie._popupComponent;
            this._currentPopupComponent = new MoviePopupView(data);
            this._currentPopupComponent.setCloseClickHandler(this._instanceAllMovie._handleClosePopupClick);
            this._currentPopupComponent.setFavoriteClickHandler(this._instanceAllMovie._handleFavoriteClick);
            this._currentPopupComponent.setWatchlistClickHandler(this._instanceAllMovie._handleWatchlistClick);
            this._currentPopupComponent.setHistoryClickHandler(this._instanceAllMovie._handleHistoryClick);
            replace(this._currentPopupComponent, prevPopup);
            remove(prevPopup);
          }
        }
        /*
        if(this._instanceRatingMovie !== null) {
          this._ratingMoviePresenter.get(data.id).init(data);
          if(this._ratingMoviePresenter._popupComponent !== null) {

          }
          //(this._instanceRatingMovie !== Mode.DEFAULT);
        }
        if (this._instanceCommentedMovie !== null) {
          this._commentedMoviePresenter.get(data.id).init(data);
          if(this._commentedMoviePresenter._popupComponent !== null) {

          }
          //(this._instanceCommentedMovie!== Mode.DEFAULT);
        }*/

        console.log('data.isWatchlist, data.isHistory, data.isFavorite', [data.isWatchlist, data.isHistory, data.isFavorite]);
        //this._clearMovieList();
        //this._renderMovieList();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({resetSortType: true});
        this._renderMovieList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMovieList();
        break;
      case UpdateType.STAT:
        //перерисовать статистику
        break;
    }
  }
}
