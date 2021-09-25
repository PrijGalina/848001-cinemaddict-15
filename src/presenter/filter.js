import FilterView from '../view/filter';
import {filter} from '../utils/filter';
import {remove, render} from '../utils/render';
import {RenderPosition, FilterType, UpdateType} from '../const';


export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._filterComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(activeScreen) {
    const filters = this._getFilters();
    this._activeScreen = activeScreen;
    this._filterComponent = new FilterView(filters, this._filterModel.getFilter(), this._activeScreen);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this._filterComponent);
  }

  _handleModelEvent() {

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
}

/*
  _linkActiveToogle(page) {
    if(page === 'stat') {
      document.querySelectorAll('a[data-menu = "false"]').forEach((link) => {
        link.classList.add('disabled');
      });
      document.querySelector('[data-menu="MOVIES"]').classList.remove('main-navigation__item--active');
      document.querySelector('[data-menu="STATISTICS"]').classList.add('main-navigation__item--active');
    }
    else {
      document.querySelector('[data-menu="MOVIES"]').classList.add('main-navigation__item--active');
      document.querySelector('[data-menu="STATISTICS"]').classList.remove('main-navigation__item--active');
      document.querySelectorAll('a[data-menu = "false"]').forEach((link) => {
        link.classList.remove('disabled');
      });
    }
  }

  _handleSiteMenuClick(element) {
    if (element.classList.contains('main-navigation__item--active')) {
      return;
    }
    const menuItem = element.dataset.menu;
    moviesPresenter._currentSortType = SortType.DEFAULT;

    switch (menuItem) {
      case MenuItem.MOVIES:
        moviesPresenter.init();
        (document.querySelector('.statistic')) ? document.querySelector('.statistic').remove() : '';
        this._linkActiveToogle('movie');
        break;
      case MenuItem.STATISTICS:
        //this._filterModel.setStatFilter(UpdateType.STAT, filterStatsType.ALL_TIME);
        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
        moviesPresenter.destroy();
        this._statisticComponent = new StatisticsView(this._moviesModel, this._statsFilter, this._filterModel.getStatFilter());
        this._statisticComponent.setFilterChangeStatistic(this._handlerFilterTypeStatistic);
        render(siteMainElement, this._statisticComponent, RenderPosition.BEFOREEND);
        this._linkActiveToogle('stat');
        break;
    }
  }


  _handlerFilterTypeStatistic(filterType) {
    if (this._filterModel.getStatFilter() === filterType) {
      return;
    }
    this._filterModel.setStatFilter(UpdateType.MAJOR, filterType);
    remove(this._statisticComponent);
    this._statisticComponent = new StatisticsView(this._moviesModel, this._statsFilter, this._filterModel.getStatFilter());
    this._statisticComponent.setFilterChangeStatistic(this._handlerFilterTypeStatistic);
    render(siteMainElement, this._statisticComponent, RenderPosition.BEFOREEND);
  }*/
