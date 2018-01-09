import { getUrlParams } from './utils';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    id: i,
    startCity: 'aa',
    arrCity: 'bb',
    lianxi: '2wew',
    name: '2wew',
    disabled: ((i % 6) === 0),
    no: `TradeCode ${i}`,
    num: Math.floor(Math.random() * 1000),
    tel: Math.floor(Math.random() * 1000),
    money: Math.floor(Math.random() * 1000),
    iphone: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 3,
    source: Math.floor(Math.random() * 10) % 2,
    time: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    loginTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    registerTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
  });
}
export function getFlightstock(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.current),
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getFlightstock,
};
