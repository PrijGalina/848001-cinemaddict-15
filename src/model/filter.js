import AbstractObserver from '../utils/abstract-observer';
import {FilterType, filterStatsType} from '../const';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
    this._activeStatFilter = filterStatsType.ALL_TIME;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }

  setStatFilter(updateType, filter) {
    this._activeStatFilter = filter;
    this._notify(updateType, filter);
  }

  getStatFilter() {
    return this._activeStatFilter;
  }
}

