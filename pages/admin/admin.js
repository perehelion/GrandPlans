var input = document.querySelector('input');
var preview = document.querySelector('.preview');

input.style.opacity = 0;
input.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  var curFiles = input.files;
  if (curFiles.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'No files currently selected for upload';
    preview.appendChild(para);
  } else {
    var list = document.createElement('ol');
    preview.appendChild(list);
    for (var i = 0; i < curFiles.length; i++) {
      var listItem = document.createElement('li');
      var para = document.createElement('p');
      if (validFileType(curFiles[i])) {
        para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
        var image = document.createElement('img');
        image.src = window.URL.createObjectURL(curFiles[i]);

        listItem.appendChild(image);
        listItem.appendChild(para);

      } else {
        para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
        listItem.appendChild(para);
      }

      list.appendChild(listItem);
    }
  }
}
var fileTypes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png'
]

function validFileType(file) {
  for (var i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true;
    }
  }

  return false;
}

function returnFileSize(number) {
  if (number < 1024) {
    return number + 'bytes';
  } else if (number > 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'KB';
  } else if (number > 1048576) {
    return (number / 1048576).toFixed(1) + 'MB';
  }
}

/**
 *
 */
const homeUrl = "/";
const mainTables = ["goods", "services", "news", "todos"];
const firstLevelButtonClasses = [
  "new-group",
  "new-item",
  "new-todos",
  "new-news",
  "del-parent-group",
  "del-parent-item"
];
let tables = [];
let fetchPromises = [];
let saveQueryStack = [];
let noId_count = 0;

let data_sample = {
  mode: "read",
  table: "goods",
  arr: {
    id: new Number(),
    name: new String(),
    title: new String(),
    notes: new String(),
    content: new String(),
    price_coins: new Number(),
    group_name: new String(),
    new_name: new String(),
    new_price: new Number(),
    new_notes: new String()
  }
};

$(function () {
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
      if (table.tableName == "todos" || table.tableName == "news") {} else {
        table.groups = getUniqueGroupNames(table.items);
        embedGroups((tabName = table.tableName), (groups = table.groups));
      }
      embedItems((tab = table));
    });

    firstLevelButtonClasses.map(buttonClass => {
      embedInteraction(buttonClass);
    });
  });
});

function embedInteraction(buttonClass) {
  const allClasses = {
    firstLevel: [
      "new-group",
      "new-item",
      "new-todos",
      "new-news",
      "del-parent-group",
      "del-parent-item"
    ],
    secondLevel: ["del-parent-cancel", "embed-entered-group"]
  };
  switch (buttonClass) {
    case "new-group":
      /**
       * calls for a group constructor
       */
      {
        $(".newbie.new-group").on("click", event => {
          $(event.target)
            .parent()
            .before(htmlGenerator((type = "group constructor")));
          embedInteraction("del-parent-cancel");
          embedInteraction("embed-entered-group");
          $(event.target).toggleClass("newbie");
        });
      }

      break;

    case "new-item":
      /**
       * calls for an item constructor
       */

      {
        $(".newbie.new-item").on("click", event => {
          $(event.target)
            .parent()
            .before(htmlGenerator((type = "item constructor")));
          embedInteraction("del-parent-cancel");
          embedInteraction("embed-entered-item");
          $(event.target).toggleClass("newbie");
        });
      }
      break;

    case "new-todos":
      /**
       * calls for a todos constructor
       */
      {
        $(".newbie.new-todos").on("click", event => {
          $(event.target)
            .parent()
            .before(htmlGenerator((type = "todos constructor")));
          embedInteraction("del-parent-cancel");
          embedInteraction("embed-entered-item");
          $(event.target).toggleClass("newbie");
        });
      }

      break;

    case "new-news":
      /**
       * calls for a news constructor
       */
      {
        $(".newbie.new-news").on("click", event => {
          $(event.target)
            .parent()
            .before(htmlGenerator((type = "news constructor")));
          embedInteraction("del-parent-cancel");
          embedInteraction("embed-entered-item");
          $(event.target).toggleClass("newbie");
        });
      }

      break;

    case "del-parent-cancel":
      /**
       *deletes the constructor on clicking corresponding button,
       *while canceling adding new item or group
       */
      {
        $(".newbie.del-parent-cancel").on("click", event => {
          $(event.target.parentNode).remove();
        });
        break;
      }

    case "del-parent-item":
      /**
       *deletes an item on clicking corresponding button
       */
      {
        $(".newbie.del-parent-item").on("click", event => {
          let itId;
          try {
            itId = event.target.parentNode.parentNode.id
              .split("#")[1]
              .split("-");
          } catch (typeError) {
            if (typeError.name == "TypeError") {
              itId = event.target.parentNode.parentNode.id.split("-");
            }
          }

          if (itId[0] == "noId") {
            saveQueryStack.map(q => {
              if (q.arr.itId == itId.join("-")) {
                q.mode = "canceled";
              }
            });
          } else if (itId[0] == "goods" || itId[0] == "services") {
            saveQueryStack.push({
              mode: "delete",
              table: itId[0],
              arr: {
                id: itId[3]
              }
            });
          } else if (itId[0] == "todos" || itId[0] == "news") {
            saveQueryStack.push({
              mode: "delete",
              table: itId[0],
              arr: {
                id: itId[1]
              }
            });
          }

          $(event.target.parentNode)
            .parent()
            .remove();
        });
      }
      break;

    case "del-parent-group":
      /**
       * deletes an group and all descendant items on clicking corresponding button
       */
      {
        $(".newbie.del-parent-group").on("click", event => {
          $(event.target.parentNode.parentNode.childNodes[3].childNodes).map(
            (i, el) => {
              let itId;
              try {
                itId = el.id.split("#")[1].split("-");
              } catch (typeError) {
                if (typeError.name == "TypeError") {
                  itId = el.id.split("-");
                }
              }

              if (itId[0] == "noId") {
                saveQueryStack.map(q => {
                  if (q.arr.itId == itId.join("-")) {
                    q.mode = "canceled";
                  }
                });
              } else if (itId[0] == "goods" || itId[0] == "services") {
                saveQueryStack.push({
                  mode: "delete",
                  table: itId[0],
                  arr: {
                    id: itId[3]
                  }
                });
              } else if (itId[0] == "todos" || itId[0] == "news") {
                saveQueryStack.push({
                  mode: "delete",
                  table: itId[0],
                  arr: {
                    id: itId[1]
                  }
                });
              }
            }
          );

          $(event.target.parentNode)
            .parent()
            .remove();
        });
      }
      break;

    case "embed-entered-group":
      /**
       * embeds data from group constructor
       * after clicking correspond button
       */

      {
        $(".newbie.embed-entered-group").on("click", event => {
          let newGroupName = $(event.target.parentNode)
            .children("input.name")
            .val();
          let newGroupTable = $(event.target.parentNode.parentNode)
            .attr("id")
            .split("-")[0];

          groups.push(newGroupName);

          $(event.target.parentNode).before(
            htmlGenerator(
              (type = "new group"),
              (args = {
                group_id: `${newGroupTable}-${groups[groups.length - 1]}`,
                group_name: newGroupName
              })
            )
          );
          $(event.target.parentNode).remove();
          embedInteraction("new-item");
          embedInteraction("del-parent-group");
        });
      }
      break;

    case "embed-entered-item":
      /**
       * embeds data from item constructor
       * after clicking correspond button
       */
      {
        $(".newbie.embed-entered-item").on("click", event => {
          let tempParams = new Object();
          $(event.target)
            .siblings("input")
            .map((i, elem) => {
              if (elem.type != "file") {
                if ($(elem).val() == "") {
                  $(elem)
                    .siblings("b")
                    .text("Слід заповнити всі ці поля")
                    .css({
                      color: "red"
                    });
                  tempParams.isAllowed = false;
                } else {
                  tempParams.isAllowed = true;
                  tempParams[$(elem).attr("class")] = $(elem).val();
                }
              }
            });

          if (tempParams.isAllowed) {
            tempParams.tableName = event.target.parentNode.parentNode.id.split(
              "-"
            )[0];
            tables.slice(0, 2).map(table => {
              if (table.tableName == tempParams.tableName) {
                tempParams.group_name =
                  table.groups[
                    event.target.parentNode.parentNode.id.split("-")[1]
                  ];
              }
            });

            $(event.target.parentNode).before(
              htmlGenerator(
                (type = "new item"),
                (args = {
                  itemId: "noId-" + noId_count,
                  name: tempParams.name,
                  price_coins: tempParams.price * 100,
                  notes: tempParams.notes
                })
              )
            );

            saveQueryStack.push({
              mode: "add",
              table: tempParams.tableName,
              arr: {
                name: tempParams.name,
                notes: tempParams.notes,
                price_coins: parseInt(tempParams.price * 100),
                group_name: tempParams.group_name,
                itId: "noId-" + noId_count++
              }
            });

            $(event.target.parentNode).remove();
            embedInteraction("del-parent-item");
          }
        });
      }
    default:
      break;
  }
}

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
  let dadId;
  tab.items.map(item => {
    if (item.group_name != undefined) {
      dadId = `#${tab.tableName}-${groups.indexOf(item.group_name)}-list`;
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
      dadId = `#${tab.tableName}-list`;
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
      dadId = `#${tab.tableName}-list`;
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
  if (dadId.split("-").length == 2) {
    let temp = `<li class = 'staff-item'>\
                  <button class='btn newbie new-${tab.tableName}'>+</button>\
                </li>`;
    $(dadId).append(temp);
  }
}

function htmlGenerator(type = "", args = new Object()) {
  switch (type) {
    case "item constructor":
      return `<li  class='staff-item constructor'>\
              <b>Новий запис</b>  <br>  \
              <input class="name" type="text" placeholder="Назва">  <br>  \
              <input class="price" type="number" min="0" placeholder="Ціна">  <br>  \
              <input class="notes" type="text" placeholder="Опис">  <br>  \
              <label>Картинка: </label>  <input type="file">  <br>  \
              <button class="btn newbie embed-entered-item">🗸</button>  \
              <button class="btn newbie del-parent-cancel">🗴</button>  \
              </li>`;

    case "news constructor":
      return `<li  class='staff-item constructor'>\
                <b>Новий запис</b>  <br>  \
                <input class="title" type="text" placeholder="Заголовок">  <br>  \
                <textarea class="cotent" placeholder="Впишіть сюди суть новини" rows="4" cols="45"></textarea> <br>\
                <label>Картинка: </label>  <input type="file">  <br>  \
                <button class="btn newbie embed-entered-item">🗸</button>  \
                <button class="btn newbie del-parent-cancel">🗴</button>  \
              </li>`;

    case "todos constructor":
      return `<li  class='staff-item constructor'>\
                <b>Новий запис</b>  <br>  \
                <input class="name" type="text" placeholder="Назва пункту">  <br>  \
                <input class="notes" type="text" placeholder="Опис">  <br>  \
                <label>Картинка: </label>  <input type="file">  <br>  \
                <button class="btn newbie embed-entered-item">🗸</button>  \
                <button class="btn newbie del-parent-cancel">🗴</button>  \
              </li>`;

    case "group constructor":
      return `<li class="staff-group constructor">\
                <span>Нова Група </span>  <br>  \
                <input class="name" type="text" placeholder="Назва групи">  <br>  \
                <button class="btn newbie embed-entered-group">🗸</button>  \
                <button class="btn newbie del-parent-cancel">🗴</button>  \
              </li>`;

    case "new group":
      return `<li id='${args.group_id}' class='staff-group'> \
                <h2 class='group-name'>${args.group_name}\
                  <button class='btn newbie edit-group'>🖉</button>\
                  <button class="btn newbie del-parent-group">🗑</button>\
                </h2>
                <ul id='${args.group_id}-list'><li class = 'staff-item'>\
                  <button class="btn newbie new-item">+</button>\
                </li></ul>\
              </li>`;
    case "new item":
      return `<li id='${args.itemId}' class='staff-item'> \
                <span>
                  <b class='item-name'>${args.name}</b><br>\
                  <u class='item-price'>${args.price_coins / 100}грн</u><br>\
                  <i class='item-notes'>${args.notes}</i><br>\
                  <button class="btn newbie edit-item">🖉</button>\
                  <button class="btn newbie del-parent-item">🗑</button>\
                </span>
              </li>`;
    case "new news":
      return `<li id='${args.newsId}' class='staff-item'> \
                <span>
                  <b class='item-name'>${args.title}</b><br>\
                  <span class='item-content'>${args.content}</span><br>\
                  <button class="btn newbie edit-item">🖉</button>\
                  <button class="btn newbie del-parent-item">🗑</button>\
                </span>
              </li>`;
    case "new todos":
      return `<li id='${args.todosId}' class='staff-item'> \
                <span>
                  <b class='item-name'>${args.name}</b><br>\
                  <i class='item-notes'>${args.notes}</i><br>\
                  <button class="btn newbie edit-item">🖉</button>\
                  <button class="btn newbie del-parent-item">🗑</button>\
                </span>
              </li>`;
    default:
      return "ALERT!!!! sth went wrong";
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
    .each(function () {
      $(this).css({
        "background-color": "rgb(" +
          Math.floor(Math.random() * 55 + 200).toString() +
          ", " +
          Math.floor(Math.random() * 55 + 200).toString() +
          ", " +
          Math.floor(Math.random() * 55 + 200).toString() +
          ")"
      });
    });
}