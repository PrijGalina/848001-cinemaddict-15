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
    this.setMenuClickHandler = this.setMenuClickHandler.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(activeScreen) {
    const filters = this._getFilters();
    this._activeScreen = activeScreen;
    this._filterComponent = new FilterView(
      filters,
      this._filterModel.getFilter(),
      this._activeScreen,
    );
    this._filterComponent.setFilterTypeChangeHandler(
      this._handleFilterTypeChange,
    );
    this._filterComponent.setMenuClickHandler(this._menuClickItem);
    render(
      this._filterContainer,
      this._filterComponent,
      RenderPosition.AFTERBEGIN,
    );
  }

  destroy() {
    remove(this._filterComponent);
  }

  _handleModelEvent() {}

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._filterComponent.updateFilter(filterType);
    this._filterComponent.setFilterTypeChangeHandler(
      this._handleFilterTypeChange,
    );
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

  setMenuClickHandler(callback) {
    this._menuClickItem = callback;
  }
}
