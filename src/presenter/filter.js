import {moviesPresenter, siteMainElement} from '../main';
import FilterView from '../view/filter';
import StatisticsView from '../view/statistics';
import {filter} from '../utils/filter';
import {remove, render, replace} from '../utils/render';
import {RenderPosition, FilterType, UpdateType, MenuItem, SortType} from '../const';


export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._filterComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setMenuClickHandler(this._handleSiteMenuClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
    ];
  }

  _handleSiteMenuClick(element) {
    if (element.classList.contains('main-navigation__item--active')) {
      return;
    }
    const menuItem = element.dataset.menu;
    moviesPresenter._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    switch (menuItem) {
      case MenuItem.MOVIES:
        document.querySelector('[data-menu="MOVIES"]').classList.add('main-navigation__item--active');
        document.querySelector('[data-menu="STATISTICS"]').classList.remove('main-navigation__item--active');
        moviesPresenter.init();
        document.querySelector('.statistic').remove();
        break;
      case MenuItem.STATISTICS:
        document.querySelector('[data-menu="MOVIES"]').classList.remove('main-navigation__item--active');
        document.querySelector('[data-menu="STATISTICS"]').classList.add('main-navigation__item--active');
        moviesPresenter.destroy();
        render(siteMainElement, new StatisticsView(this._moviesModel), RenderPosition.BEFOREEND);
        break;
    }
  }
}

