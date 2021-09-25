import AbstractView from './abstract';
import {MenuItem} from '../const';

const createMenuContainer = (active) => (
  `<a href="#stats" class="main-navigation__additional ${(active === MenuItem.STATISTICS) ? 'main-navigation__item--active' : ''}" data-menu=${MenuItem.STATISTICS}>Stats</a>`
);

export default class Menu extends AbstractView {
  constructor(active) {
    super();
    this._active = active;
    this._menuChangeHandler = this._menuChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuContainer(this._active);
  }

  _menuChangeHandler(e) {
    e.preventDefault();
    this._callback.menuChange(e.target.dataset.menu);
  }

  setMenuChangeHandler(callback) {
    this._callback.menuChange = callback;
    this.getElement().addEventListener('click', this._menuChangeHandler);
  }
}
