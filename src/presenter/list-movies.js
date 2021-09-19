import {siteMainElement} from '../main';
import MoviesContainerView from '../view/movies-container';
import SiteMenuView from '../view/site-menu';
import NoMovieView from '../view/no-movie';
import AllMoviesView from '../view/all-movies-block';
import TopRatedView from '../view/rated-movies-block';
import MostCommentedView from '../view/commented-movies-block';
import SortingView from '../view/sorting';
import ShowMoreButtonView from '../view/show-more-button';
import {remove, render} from '../utils/render';
import {sortMovieDate, sortMovieRating, sortMovieComments} from '../utils/common';
import MoviePresenter from '../presenter/movie';
import {SortType, MoviesListType, RenderPosition, UserAction, UpdateType} from '../const';

const MOVIE_COUNT_PER_STEP = 5;
const NUMBER_OF_FIRST = 0;

export default class MoviesList {
  constructor(mainContainer, moviesModel, commentsModel) {
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;

    this._mainContainer = mainContainer;

    this._moviePresenter = new Map();
    this._ratingMoviePresenter = new Map();
    this._commentedMoviePresenter = new Map();

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._siteMenuComponent = null;
    this._moviesComponent = new MoviesContainerView();
    this._noMoviesComponent = new NoMovieView();
    this._allMoviesComponent = new AllMoviesView();
    this._ratedMoviesComponent = new TopRatedView();
    this._commentedMoviesComponent = new MostCommentedView();

    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlerLoadMoreButtonClick = this._handlerLoadMoreButtonClick.bind(this);
    this._handlerMovieChange = this._handlerMovieChange.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerCommentsChange = this._handlerCommentsChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSiteMenu();
    render(this._mainContainer, this._moviesComponent, RenderPosition.BEFOREEND);
    this._renderMovieList();
  }

  _getMovies() {
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return this._moviesModel.getMovies().slice().sort(sortMovieDate);
      case SortType.BY_RATING:
        return this._moviesModel.getMovies().slice().sort(sortMovieRating);
      case SortType.BY_COMMENTS_COUNT:
        return this._moviesModel.getMovies().slice().sort(sortMovieComments);
    }

    return this._moviesModel.getMovies();
  }

  _getComments(filmId) {
    return this._commentsModel.getComments().filter((comment) => comment.aboutFilm === filmId);
  }

  _renderSiteMenu() {
    (this._siteMenuComponent !== null) ? this._siteMenuComponent = null : '';
    this._siteMenuComponent = new SiteMenuView(this._moviesModel.getMovies());
    this._siteMenuComponent.setFilterDataChange(this._handleFilterChange);
    render(siteMainElement, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoMovies() {
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
    render(this._allMoviesComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _siteMenuQuantityUpdate(){
    remove(this._siteMenuComponent);
    this._renderSiteMenu();
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
  }

  _handlerMovieChange(updatedMovie) {
    //вызвать обновление модели
    (this._commentedMoviePresenter.get(updatedMovie.id)) ? this._commentedMoviePresenter.get(updatedMovie.id).init(updatedMovie) : '';
    (this._ratingMoviePresenter.get(updatedMovie.id)) ? this._ratingMoviePresenter.get(updatedMovie.id).init(updatedMovie) : '';
    (this._moviePresenter.get(updatedMovie.id)) ? this._moviePresenter.get(updatedMovie.id).init(updatedMovie) : '';
    this._siteMenuQuantityUpdate();
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

  _handlerCommentsChange(changedMovie) {
    this._handlerMovieChange(changedMovie);
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
          //this._commentsAboutMovie = this._getComments(movie.filmId);
          const container = this._allMoviesComponent;
          moviePresenter = new MoviePresenter(container, this._commentsModel, this._handlerMovieChange, this._handlerModeChange, this._handlerCommentsChange);
          moviePresenter.init(movie);
          this._moviePresenter.set(movie.id, moviePresenter);
        });
        (canShowMore && !alreadyExistsButton) ? this._renderLoadMoreButton() : '';
        break;
      case MoviesListType.RATED:
        array.forEach((movie) => {
          //this._commentsAboutMovie = this._getComments(movie.filmId);
          const container = this._ratedMoviesComponent;
          moviePresenter = new MoviePresenter(container, this._commentsModel, this._handlerMovieChange, this._handlerModeChange, this._handlerCommentsChange);
          moviePresenter.init(movie);
          this._ratingMoviePresenter.set(movie.id, moviePresenter);
        });
        break;
      case MoviesListType.COMMENTED:
        array.forEach((movie) => {
          //this._commentsAboutMovie = this._getComments(movie.filmId);
          const container = this._commentedMoviesComponent;
          moviePresenter = new MoviePresenter(container, this._commentsModel, this._handlerMovieChange, this._handlerModeChange, this._handlerCommentsChange);
          moviePresenter.init(movie);
          this._commentedMoviePresenter.set(movie.id, moviePresenter);
        });
        break;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    console.log('actionType', actionType); // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    console.log('updateType', updateType); // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    console.log('update', update); // update - обновленные данные

    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.UPDATE_MOVIE:
        this._moviesModel.updateMovieData(updateType, update);
        break;
      case UserAction.UPDATE_MOVIE_VIEW:
        this._moviesModel.updateMovieView(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    console.log('updateType', updateType);
    console.log('data', data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)

    switch(updateType) {
      case UpdateType.PATCH:
        // - обновить элемент
        this._moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список
        //this._clearMovieList();
        //this._renderMovieList();
        break;
      case UpdateType.MAJOR:
        // - обновить все (меню, список)
        //this._clearMovieList({resetRenderedMovieCount: true, resetSortType: true});
        //this._renderMovieList();
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
    remove(this._noMoviesComponent);
    remove(this._showMoreButtonComponent);
    remove(this._allMoviesComponent);
    remove(this._ratedMoviesComponent);
    remove(this._commentedMoviesComponent);
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

    render(this._moviesComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);
    render(this._moviesComponent, this._ratedMoviesComponent, RenderPosition.BEFOREEND);
    render(this._moviesComponent, this._commentedMoviesComponent, RenderPosition.BEFOREEND);

    const listOfAllMovies = movies.slice(NUMBER_OF_FIRST, this._renderedMoviesCount);
    const listOfRatedMovies = movies.slice().sort(sortMovieRating).slice(NUMBER_OF_FIRST, MoviesListType.COMMENTED.movieCount);
    const listOfCommentedMovies = movies.slice().sort(sortMovieComments).slice(NUMBER_OF_FIRST, MoviesListType.COMMENTED.movieCount);
    //const listOfRatedMovies = movies.slice().sort(sortMovieRating).slice(NUMBER_OF_FIRST, MoviesListType.COMMENTED.movieCount);
    //const listOfCommentedMovies = movies.slice().sort(sortMovieComments).slice(NUMBER_OF_FIRST, MoviesListType.COMMENTED.movieCount);

    this._renderMovieListByType(listOfAllMovies, MoviesListType.ALL);
    this._renderMovieListByType(listOfRatedMovies, MoviesListType.RATED);
    this._renderMovieListByType(listOfCommentedMovies, MoviesListType.COMMENTED);
  }
}
