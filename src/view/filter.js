import AbstractView from './abstract';
import {MenuItem, FilterType} from '../const.js';

const createMenuItem = (activeScreen) => `<a href="#all" class="main-navigation__item ${(activeScreen === MenuItem.MOVIES) ? 'main-navigation__item--active' : ''}"  data-menu="${MenuItem.MOVIES}" data-value="${FilterType.ALL}">All movies </a>`;


const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-value="${type}">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterTemplate = (filterItems, currentFilterType, activeScreen) => {
  const menuItemTemplate = createMenuItem(activeScreen);
  console.log('activeFilter', activeScreen);
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
      ${menuItemTemplate}
      ${filterItemsTemplate}
    </div>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType, activeScreen) {
    super();
    this._filters = filters;
    this._activeScreen = activeScreen;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    //this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._activeScreen);
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
/*
  _menuClickHandler(e) {
    e.preventDefault();
    this._callback.menuClick();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.
  }
  */
}
