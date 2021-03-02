import $ from 'jquery';

export const GET = (url) => new Promise((resolve, reject) => {
  $.get({
    method: 'GET',
    url
  })
    .done(res => {
      resolve(res);
    })
    .fail(err => {
      console.log(console.log(err, 'Fail to fetch list'));
      reject(err);
    })
});