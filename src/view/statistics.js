import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {durationWatchedMovies, getGenreStat, getFavoriteGenre} from '../utils/statistic';
import {FilterStatisticType} from '../const';


const createStatisticsTemplate = (data) => {
  const completedTaskCount = 1;
  const movies = data;
  console.log('data in stat', data);
//  const durationArray = durationWatchedMovies(movies);
  //const genreStat = getGenreStat(movies);
  //const favoriteGenre = getFavoriteGenre(genreStat);

  const durationArray = [1, 0];
  const genreStat = 2;
  const favoriteGenre = 3;

  movies.forEach((movie) => {
    //console.log('movie watchtime', movie.user_details.watching_date);
  });

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${FilterStatisticType.ALL_TIME}" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${FilterStatisticType.TODAY}">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${FilterStatisticType.WEEK}">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${FilterStatisticType.MONTH}">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${FilterStatisticType.YEAR}">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${completedTaskCount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${(movies.length > 0) ? `<p class="statistic__item-text">${durationArray[0]} <span class="statistic__item-description">h</span> ${durationArray[1]} <span class="statistic__item-description">m</span></p>` : '<p class="statistic__item-text">0</p>'}
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        ${(movies.length > 0) ? `<p class="statistic__item-text">${favoriteGenre}</p>`: ''}
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(movies, filters, currentFilter) {
    super();
    this._movies = movies;
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._setCharts();

    console.log('this._filters', this._filters);
    console.log('this._currentFilter', this._currentFilter);
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate(this._movies);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _filterTypeChangeHandler(e) {
    this._callback.sortChange(e.target.id);
  }

  setFilterChangeStatistic(callback) {
    this._callback.sortChange = callback;
    this.getElement().querySelectorAll('.statistic__filters-input').forEach((sortItem) => {
      sortItem.addEventListener('change', this._filterTypeChangeHandler);
    });
  }

  _setCharts() {
    // Нужно отрисовать два графика
  }
}
