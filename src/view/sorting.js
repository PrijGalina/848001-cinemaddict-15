import AbstractView from './abstract';
import {SortType} from '../const';

const createSortingTemplate = (currentSortType) => `<ul class="sort">
      <li><a href="#" class="sort__button ${(currentSortType === SortType.DEFAULT) ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${(currentSortType === SortType.BY_DATE) ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${(currentSortType === SortType.BY_RATING) ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
    </ul>`;

export default class Sorting extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
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
