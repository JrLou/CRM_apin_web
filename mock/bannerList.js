import { getUrlParams } from './utils';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    index:i%5+1,
    id: `imgID${i}`,
    imgName:`imgName${i}`,
    goLink: 'https://ant.design',
    imgUrl: ['https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png', 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'][i % 2],
    no: `TradeCode ${i}`,
    iphone: Math.floor(Math.random() * 1000),
    status: ((i % 3) === 0)?1:0,
    updataTime:new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    validity: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
  });
}

export function bannerList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];


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

  if (params.id && params.status===undefined) {
    dataSource = dataSource.filter(data => data.id.indexOf(params.id) < 0);
  }

  if(params.id && params.status!==undefined){
    for(let key in dataSource){
      if(dataSource[key].id == params.id){
        dataSource[key].status = params.status;
      }
    }
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    data:{
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    },
    message:'success',
    code:200,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export default {
  bannerList,
};
