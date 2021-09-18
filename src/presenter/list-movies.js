import {siteMainElement} from '../main';
import MoviesContainerView from '../view/movies-container';
import SiteMenuView from '../view/site-menu';
import NoMovieView from '../view/no-movie';
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
    this._allMoviePresenter = new Map();
    this._ratedMoviePresenter = new Map();
    this._commentedMoviePresenter = new Map();
    this._commentsArray = [];
    this._sortedByRating = [];
    this._sortedByComments = [];
    this._commentsAboutFilm = [];
    this._renderedMoviesCount =  MOVIE_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._moviesContainer = new MoviesContainerView();
    this._noMoviesComponent = new NoMovieView();
    this._sortComponent = new SortingView();
    this._showMoreButton = new ShowMoreButtonView();

    this._handlerLoadMoreButtonClick = this._handlerLoadMoreButtonClick.bind(this);
    this._handlerMovieChange = this._handlerMovieChange.bind(this);
    this._handlerModeChange = this._handlerModeChange.bind(this);
    this._handlerCommentsChange = this._handlerCommentsChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
  }

  init() {
    //this._sourcedMovies = movies.slice();
    //this._commentsArray = comments;
    this._renderSiteMenu();
    render(this._mainContainer, this._moviesContainer, RenderPosition.BEFOREEND);
    this._renderMoviesContainer();
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
    this._siteMenu = new SiteMenuView(this._moviesModel.getMovies());
    render(siteMainElement, this._siteMenu, RenderPosition.BEFOREEND);
    this._siteMenu.setFilterDataChange(this._handleFilterChange);
  }

  _renderNoMovies() {
    render(this._mainContainer, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._moviesContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderLoadMoreButton() {
    render(MoviesListType.ALL.view, this._showMoreButton, RenderPosition.BEFOREEND);
    this._showMoreButton.setClickHandler(this._handlerLoadMoreButtonClick);
  }

  _siteMenuQuantityUpdate(){
    remove(this._siteMenu);
    this._siteMenu = new SiteMenuView(this._movies);
    render(siteMainElement, this._siteMenu, RenderPosition.AFTERBEGIN);
  }

  _handlerLoadMoreButtonClick() {
    const movieCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(movieCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMoviesCount, newRenderedMoviesCount);

    this._renderMoviesList(movies, MoviesListType.ALL);

    this._renderedMoviesCount = newRenderedMoviesCount;
    (this._renderedMoviesCount >= this._movies.length) ? this._showMoreButton.getElement().remove() : '';
  }

  _handlerModeChange() {
    this._allMoviePresenter !== undefined ? this._allMoviePresenter.forEach((presenter) => presenter.resetView()) : '';
    this._ratedMoviePresenter !== undefined ? this._ratedMoviePresenter.forEach((presenter) => presenter.resetView()) : '';
    this._commentedMoviePresenter !== undefined ? this._commentedMoviePresenter.forEach((presenter) => presenter.resetView()) : '';
  }

  _clearMoviesList() {
    this._allMoviePresenter.forEach((presenter) => presenter.destroy());
    this._allMoviePresenter.clear();
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButton);
  }

  _handlerMovieChange(updatedMovie) {
    //вызвать обновление модели
    if(this._allMoviePresenter.has(updatedMovie.id)) {
      this._allMoviePresenter.get(updatedMovie.id).init(updatedMovie);
    }

    if (this._ratedMoviePresenter.has(updatedMovie.id)) {
      this._ratedMoviePresenter.get(updatedMovie.id).init(updatedMovie);
    }

    if (this._commentedMoviePresenter.has(updatedMovie.id)) {
      this._commentedMoviePresenter.get(updatedMovie.id).init(updatedMovie);
    }

    this._siteMenuQuantityUpdate();
  }

  _handleSortTypeChange(sortType) {
    //sorting
    if(this._currentSortType === sortType) {
      return;
    }

    this._sortMovies(sortType);

    //clean
    this._clearMoviesList();

    //render
    this._renderMoviesList(this._movies, MoviesListType.ALL, NUMBER_OF_FIRST, this._renderedMoviesCount);
  }

  _handlerCommentsChange(changedMovie) {
    this._handlerMovieChange(changedMovie);
  }

  _handleFilterChange(){
    //console.log('FilterChange');
  }

  _renderMovieItem(movie, type) {
    this._commentsAboutFilm = this._getComments(movie.filmId);

    if (type === MoviesListType.ALL) {
      const allMoviePresenter = new MoviePresenter(type.view, this._commentsAboutFilm, this._handlerMovieChange, this._handlerModeChange, this._handlerCommentsChange);
      allMoviePresenter.init(movie);
      this._allMoviePresenter.set(movie.id, allMoviePresenter);
    }
    else if (type === MoviesListType.RATED) {
      const ratedMoviePresenter = new MoviePresenter(type.view, this._commentsAboutFilm, this._handlerMovieChange, this._handlerModeChange, this._handlerCommentsChange);
      ratedMoviePresenter.init(movie);
      this._ratedMoviePresenter.set(movie.id, ratedMoviePresenter);
    }
    else if (type === MoviesListType.COMMENTED) {
      const commentedMoviePresenter = new MoviePresenter(type.view, this._commentsAboutFilm, this._handlerMovieChange, this._handlerModeChange, this._handlerCommentsChange);
      commentedMoviePresenter.init(movie);
      this._commentedMoviePresenter.set(movie.id, commentedMoviePresenter);
    }
  }

  _renderMoviesList(array, type) {
    array
      .forEach((movie) => this._renderMovieItem(movie, type));
    (type === MoviesListType.ALL && array.length > MOVIE_COUNT_PER_STEP) ? this._renderLoadMoreButton() : '';
  }

  _renderContainersMovieCategory() {
    render(this._moviesContainer, MoviesListType.ALL.view, RenderPosition.BEFOREEND);
    render(this._moviesContainer, MoviesListType.RATED.view, RenderPosition.BEFOREEND);
    render(this._moviesContainer, MoviesListType.COMMENTED.view, RenderPosition.BEFOREEND);

    const moviesAllCurrent = this._getMovies().slice(NUMBER_OF_FIRST, MoviesListType.ALL.movieCount);
    const moviesRatedCurrent = this._getMovies().slice(NUMBER_OF_FIRST, MoviesListType.RATED.movieCount);
    const moviesCommentedCurrent = this._getMovies().slice(NUMBER_OF_FIRST, MoviesListType.COMMENTED.movieCount);

    this._renderMoviesList(moviesAllCurrent, MoviesListType.ALL);
    this._renderMoviesList(moviesRatedCurrent, MoviesListType.RATED);
    this._renderMoviesList(moviesCommentedCurrent, MoviesListType.COMMENTED);
  }

  _renderMoviesContainer() {
    //главный метод, вызывающий все остальные
    if (this._getMovies().length === 0){
      this._renderNoMovies();
      return;
    }
    this._renderSort();
    this._renderContainersMovieCategory();
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
        //this._moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        //
        break;
      case UpdateType.MAJOR:
        //
        break;
    }
  }
}
