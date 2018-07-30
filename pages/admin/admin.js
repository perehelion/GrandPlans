const homeUrl = "/";
let the;
let notThe;

let data = {
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


$(function () {

  $('#constructor-sample').hide()

  addClickabilityToNewbie();

  $("#item-constructor").hide();

  let anPromise = fetchForDb(data).then((res) => {
    insertGroupsByResponse(res.unique());
    insertGoodsByResponse(res)
  })
  Promise.all([anPromise]).then(() => {
    pigmantate();
  })
});