import {moviesPresenter, siteMainElement} from '../main';
import FilterView from '../view/filter';
import StatisticsView from '../view/statistics';
import {filter, filterStats, filterStatsDuration} from '../utils/filter';
import {remove, render, replace} from '../utils/render';
import {RenderPosition, FilterType, UpdateType, MenuItem, SortType, filterStatsType} from '../const';


export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._watchedMovies = [];
    this._filterComponent = null;
    this._statisticComponent = null;
    this._statsFilter = null;
    this._container =

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
    this._handlerFilterTypeStatistic = this._handlerFilterTypeStatistic.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    this._statsFilter = this._getStatisticFilters();

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

  _getStatisticFilters() {
    const movies = filter[FilterType.WATCHLIST](this._moviesModel.getMovies());
    const allTimeArray = filterStats[filterStatsType.ALL_TIME](movies);
    const todayArray = filterStats[filterStatsType.TODAY](movies);
    const weekArray = filterStats[filterStatsType.WEEK](movies);
    const monthArray = filterStats[filterStatsType.MONTH](movies);
    const yearArray = filterStats[filterStatsType.YEAR](movies);

    return [
      {
        type: filterStatsType.ALL_TIME,
        name: 'All time',
        count: allTimeArray.length,
        duration: filterStatsDuration(allTimeArray),
      },
      {
        type: filterStatsType.TODAY,
        name: 'Today',
        count: todayArray.length,
        duration: filterStatsDuration(todayArray),
      },
      {
        type: filterStatsType.WEEK,
        name: 'Week',
        count: weekArray.length,
        duration: filterStatsDuration(weekArray),
      },
      {
        type: filterStatsType.MONTH,
        name: 'Month',
        count: monthArray.length,
        duration: filterStatsDuration(monthArray),
      },
      {
        type: filterStatsType.YEAR,
        name: 'Year',
        count: yearArray.length,
        duration: filterStatsDuration(yearArray),
      },
    ];
  }

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
        this._filterModel.setStatFilter(UpdateType.STAT, filterStatsType.ALL_TIME);
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
  }
}

