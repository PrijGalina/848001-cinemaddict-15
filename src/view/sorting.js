import AbstractView from './abstract.js';
import {SortType} from '../data.js';

const createSortingTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`
);

export default class Sorting extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  _sortTypeChangeHandler(e) {
    if(e.target.tagName !== 'A') {
      return;
    }

    e.preventDefault();
    const prevActiveSortValue = this.getElement().querySelector('.sort__button--active');
    prevActiveSortValue.classList.remove('sort__button--active');
    const activeSortValue = this.getElement().querySelector(`a[data-sort-type=${e.target.dataset.sortType}`);
    activeSortValue.classList.add('sort__button--active');

    this._callback.sortTypeChange(e.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
