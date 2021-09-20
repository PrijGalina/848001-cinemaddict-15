import AbstractView from './abstract';
import {FilterType} from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (type === FilterType.ALL) ? `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-value="${type}">${name} </a>` : `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-value="${type}">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(e) {
    e.preventDefault();
    this._callback.filterTypeChange(e.target.dataset.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;

    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', this._filterTypeChangeHandler);
    });
  }
}
