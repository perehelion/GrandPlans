const homeUrl = "/";
const mainTables = ["goods", "services", "news", "todos"];
let tables = [];
let fetchPromises = [];

let data_sample = {
  mode: "read",
  table: "goods",
  arr: {
    id: undefined,
    name: undefined,
    own_earnings: undefined,
    mother: undefined,
    new_name: undefined,
    new_earnings: undefined
  }
};

$(function() {
  // temporary:
  $("#constructor-sample").hide();
  $("#item-constructor").hide();

  mainTables.map(tab => {
    fetchPromises.push(
      fetch(homeUrl, {
        method: "post",
        body: JSON.stringify({
          mode: "read",
          table: tab
        })
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
          tables.push({
            tableName: tab,
            items: res
          });
          return res;
        })
    );
  });

  Promise.all(fetchPromises).then(results => {
    // now we have all items, let's embed it

    tables.map(table => {
      if (table.tableName == "todos" || table.tableName == "news") {
      } else {
        embedGroups(
          (tabName = table.tableName),
          (groups = getUniqueGroupNames(table.items))
        );
      }
      embedItems((tab = table));
      // embedAddbuttons((tab = table));
    });
    // embedInteraction()
    // pigmantate();
  });
});

// function embedInteraction() {
//   const buttonClasses = [
//     '.construct-new-group',
//     '.construct-new-item',
//     '.add-to-page',
//     '.del-parent',
//     '.call-item-constructor',
//     '.call-group-constructor'
//   ]
//   $('.newbie.construct-new-group').on('click', (event) => {
//     console.log(event);

//     $(event.target)
//       .parent()
//       .before(htmlGenerator('group constructor'));

//   });
// }

function embedGroups(tabName, groups) {
  let tabListId = `#${tabName}-list`,
    i = 0;
  groups.map(group => {
    $(tabListId).prepend(
      htmlGenerator(
        (type = "new group"),
        (args = {
          group_id: `${tabName}-${i++}`,
          group_name: group
        })
      )
    );
  });
}

function embedItems(tab) {
  tab.items.map(item => {
    if (item.group_name != undefined) {
      let dadId = `#${tab.tableName}-${groups.indexOf(item.group_name)}-list`;
      $(dadId).prepend(
        htmlGenerator(
          (type = "new item"),
          (args = {
            itemId: `${dadId}-${item.id}`,
            name: item.name,
            price_coins: item.price_coins,
            notes: item.notes
          })
        )
      );
    } else if (tab.tableName == "news") {
      let dadId = `#${tab.tableName}-list`;
      $(dadId).append(
        htmlGenerator(
          (type = "new news"),
          (args = {
            newsId: `${tab.tableName}-${item.id}`,
            title: item.title,
            content: item.content
          })
        )
      );
    } else {
      let dadId = `#${tab.tableName}-list`;
      $(dadId).append(
        htmlGenerator(
          (type = "new todos"),
          (args = {
            todosId: `${tab.tableName}-${item.id}`,
            name: item.name,
            notes: item.notes
          })
        )
      );
    }
  });
}

function htmlGenerator(type = "", args = new Object()) {
  if (args == undefined) {
    switch (type) {
      case "item constructor":
        return `<li>\
          <span>Нова одиниця товару</span>  <br>  \
          <input class="name" type="text" placeholder="Назва товару">  <br>  \
          <input class="price" type="text" placeholder="Ціна">  <br>  \
          <label>Картинка: </label>  <input type="file">  <br>  \
          <button class="btn newbie add-to-page">Встромити в сторінку</button>  \
          <button class="btn newbie del-parent">Відмінити створення</button>  \
          </li>`;

      case "group constructor":
        return `<li>\
          <span>Нова Група </span>  <br>  \
          <input class="name" type="text" placeholder="Назва групи">  <br>  \
          <button class="btn newbie add-to-page">Встромити в сторінку</button>\
          <button class="btn newbie del-parent">Відмінити створення</button>  \
          </li>`;
      case "new group button":
        return `<li>\
          <button class="btn newbie staff-group construct-new-group">+ Групу</button>\
          </li>`;
    }
  } else {
    switch (type) {
      case "new group":
        return `<li id='${args.group_id}' class='staff-group'> \
          <h2 class='group-name'>${args.group_name}\
            <button class='btn newbie edit-group'>🖉</button>\
            <button class="btn newbie del-parent">🗑</button>\
          </h2>
          <ul id='${args.group_id}-list'><li class = 'staff-item'>\
            <button class="btn newbie construct-new-item">+</button>\
          </li></ul>\
          </li>`;
      case "new item":
        return `<li id='${args.itemId}' class='staff-item'> \
          <span>
            <b class='item-name'>${args.name}</b><br>\
            <u class='item-price'>${args.price_coins / 100}грн</u><br>\
            <i class='item-notes'>${args.notes}</i><br>\
            <button class="btn newbie edit-item">🖉</button>\
            <button class="btn newbie del-parent">🗑</button>\
          </span>
          </li>`;
      case "new news":
        return `<li id='${args.newsId}' class='staff-item'> \
        <span>
          <b class='item-name'>${args.title}</b><br>\
          <span class='item-content'>${args.content}</span><br>\
          <button class="btn newbie edit-item">🖉</button>\
          <button class="btn newbie del-parent">🗑</button>\
        </span>
        </li>`;
      case "new todos":
        return `<li id='${args.todosId}' class='staff-item'> \
        <b class='item-name'>${args.name}</b><br>\
        <i class='item-notes'>${args.notes}</i><br>\
        <button class="btn newbie call-item-constructor">🖉</button>\
        <button class="btn newbie del-parent">🗑</button>\
        </li>`;
    }
  }
}

function getUniqueGroupNames(list) {
  let obj = {};
  for (let i = 0; i < list.length; i++) {
    obj[list[i].group_name] = true;
  }
  return Object.keys(obj);
}

function pigmantate() {
  $("body")
    .find("*")
    .each(function() {
      $(this).css({
        "background-color":
          "rgb(" +
          Math.floor(Math.random() * 55 + 200).toString() +
          ", " +
          Math.floor(Math.random() * 55 + 200).toString() +
          ", " +
          Math.floor(Math.random() * 55 + 200).toString() +
          ")"
      });
    });
}
