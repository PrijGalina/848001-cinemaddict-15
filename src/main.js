import MoviesModel from './model/movies';
import FilterModel from './model/filter';
import MoviesListPresenter from './presenter/movies-list';
import FilterPresenter from './presenter/filter';
import ProfileView from './view/profile';
import MovieCounterView from './view/movie-counter';
import NavigationContainerView from './view/navigation-container';
import StatisticsView from './view/statistics';
import MenuView from './view/menu.js';
import {render, remove} from './utils/render';
import {RenderPosition, UpdateType, MenuItem, FilterType} from './const';
import {api} from './api/api';

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

let statisticsComponent = null;
let siteMenuComponent = null;
let activeScreen = MenuItem.MOVIES;

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
const navigationContainerView = new NavigationContainerView();
render(siteMainElement, navigationContainerView, RenderPosition.BEFOREEND);
const menuContainer = navigationContainerView.getElement();


const moviesPresenter = new MoviesListPresenter(siteMainElement, moviesModel, filterModel);
moviesPresenter.init();

const filterPresenter = new FilterPresenter(menuContainer, filterModel, moviesModel);

const handleSiteMenuClick = (item) => {
  switch (item) {
    case MenuItem.MOVIES:
      activeScreen = MenuItem.MOVIES;
      (siteMenuComponent !== null) ? remove(siteMenuComponent) : '';
      siteMenuComponent = null;
      siteMenuComponent = new MenuView(activeScreen);
      render(menuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuChangeHandler(handleSiteMenuClick);
      filterPresenter.destroy();
      filterPresenter.init(activeScreen);
      moviesPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      activeScreen = MenuItem.STATISTICS;
      (siteMenuComponent !== null) ? remove(siteMenuComponent) : '';
      siteMenuComponent = null;
      siteMenuComponent = new MenuView(activeScreen);
      render(menuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuChangeHandler(handleSiteMenuClick);
      filterPresenter.destroy();
      filterPresenter.init(activeScreen);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      moviesPresenter.destroy();
      statisticsComponent = new StatisticsView(moviesModel.getMovies());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.setMenuClickHandler(handleSiteMenuClick);

const movieCounterElement = document.querySelector('.footer__statistics');
render(movieCounterElement, new MovieCounterView(), RenderPosition.BEFOREEND);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    filterPresenter.init(activeScreen);
    siteMenuComponent = new MenuView(activeScreen);
    render(menuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuChangeHandler(handleSiteMenuClick);
  })
  .catch (() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    siteMenuComponent = new MenuView(activeScreen);
    render(menuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuChangeHandler(handleSiteMenuClick);
  });

export {moviesPresenter, siteMainElement};
