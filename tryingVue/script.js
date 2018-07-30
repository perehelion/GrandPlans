const homeUrl = "http://localhost:8085/"

let dataToFetch = {
  mode: "read",
  table: 'goods',
  arr: {
    id: undefined,
    name: undefined,
    own_earnings: undefined,
    mother: undefined,
    new_name: undefined,
    new_earnings: undefined
  }
}

function fetchForDb(data) {
  let response = fetch(homeUrl, {
      method: "post",
      body: JSON.stringify(data)
    })
    .then(res => {
      return res;
    })
    .then(res => {
      return res.body
        .getReader()
        .read()
        .then(done => {
          return JSON.parse(new TextDecoder("utf-8").decode(done.value));
        });
    })
    .then(res => {
      return res;
    });
  console.log(response);
  return response
}

fetchForDb(dataToFetch)

const myData = [{
  name: 'lil',
  cost: '1'
}, {
  name: 'big',
  cost: '5'
}]

let vm = new Vue({
  el: '#app',
  data: {
    msg: 'bar',
    items: myData
  }
})