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
  pigmantate();

  const itemConstructor =
    '<li>  <span>Нова одиниця товару</span>  <br>  <input class="name" type="text" placeholder="Назва товару">  <br>  <input class="price" type="text" placeholder="Ціна">  <br>  <label>Картинка: </label>  <input type="file">  <br>  <button class="btn newbie add-to-page">Встромити в сторінку</button>  <button class="btn newbie clear-from-page">Зачистити введене</button></li>';

  addClickabilityToNewbie(itemConstructor);

  $("#item-constructor").hide();

  fetchForDb(data).then((res) => {
    insertGroupsByResponse(res.unique());
    insertGoodsByResponse(res)
  })

});