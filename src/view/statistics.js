import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {getGenreStat, getFavoriteGenre} from '../utils/statistic';
import {FilterType, SortStatisticType} from '../const';
import {filter} from '../utils/filter';

const minutesInHour = 60;

const renderGenreChart = (container, movies) =>  {
  const genreStat = getGenreStat(movies);
  const labelArray = Object.keys(genreStat).map((key) => {
    if (genreStat[key] !== 0){
      return key;
    }
  });
  const dataArray = Object.keys(genreStat).map((key) => {
    if (genreStat[key] !== 0) {
      return genreStat[key];
    }
  });

  const chart = new Chart(container, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labelArray,
      datasets: [{
        data: dataArray,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        barThickness: 24,
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return chart;
};

const createStatisticsTemplate = (data) => {
  const movies = data;
  const durationInMinutes = movies.reduce((total, element) =>  (total + element.duration), 0);
  const durationInHours = Math.floor(durationInMinutes / minutesInHour);
  const remainderInMinutes = durationInMinutes - (durationInHours * minutesInHour);

  const genreStat = getGenreStat(movies);
  const favoriteGenre = getFavoriteGenre(genreStat);

  const currentSort = 'all-time';

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${SortStatisticType.ALL_TIME}" ${(currentSort === SortStatisticType.ALL_TIME) ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${SortStatisticType.TODAY}" ${(currentSort === SortStatisticType.TODAY) ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${SortStatisticType.WEEK}" ${(currentSort === SortStatisticType.WEEK) ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${SortStatisticType.MONTH}" ${(currentSort === SortStatisticType.MONTH) ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${SortStatisticType.YEAR}" ${(currentSort === SortStatisticType.YEAR) ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${data.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${(movies.length > 0) ? `<p class="statistic__item-text">${durationInHours} <span class="statistic__item-description">h</span> ${remainderInMinutes} <span class="statistic__item-description">m</span></p>` : '<p class="statistic__item-text">0</p>'}
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
  constructor(movies) {
    super();
    this._movies = movies;
    console.log('this._movies', this._movies);
    this._radioCollection = document.querySelectorAll('.statistic__filters-input');
    console.log('this._radioCollection',this._radioCollection);
    this._filtredMovie = this._getMovies();
    this._createStatisticBlock = null;
    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filtredMovie);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _filterTypeChangeHandler(e) {
    this._callback.sortChange(e.target.id);
    this.removeDataCharts(chart);
  }

  setFilterChangeStatistic(callback) {
    this._callback.sortChange = callback;
    this._radioCollection.forEach((sortItem) => {
      sortItem.addEventListener('change', this._filterTypeChangeHandler);
    });
  }

  _getMovies() {
    const watchedMovie = filter[FilterType.WATCHLIST](this._movies);

    console.log('this._radioCollection', this._radioCollection);
    return watchedMovie;
  }

  _setCharts() {
    if (this._createStatisticBlock !== null) {
      this._createStatisticBlock = null;
    }
    console.log('this._filtredMovie', this._filtredMovie);
    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    statisticCtx.height = BAR_HEIGHT * this._filtredMovie.length;

    this._genreCart = renderGenreChart(statisticCtx, this._filtredMovie);
  }

  removeDataCharts(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }
}
