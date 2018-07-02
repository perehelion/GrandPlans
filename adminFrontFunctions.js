const itemConstructor =
	'<li>  <span>Нова одиниця товару</span>  <br>  <input class="name" type="text" placeholder="Назва товару">  <br>  <input class="price" type="text" placeholder="Ціна">  <br>  <label>Картинка: </label>  <input type="file">  <br>  <button class="btn newbie add-to-page">Встромити в сторінку</button>  <button class="btn newbie clear-from-page">Зачистити введене</button></li>';


function addClickabilityToNewbie(itemConstructor) {
	// Встромити в сторінку уведений товар
	$(".newbie.btn.add-to-page").on("click", function (event) {
		addEnteredToPage(event);
		addClickabilityToNewbie(itemConstructor);
	});
	// Зачистити введене шляхом видалення материнського елементу
	$(".newbie.btn.clear-from-page").on("click", function (event) {
		$(event.target)
			.parent()
			.remove();
	});
	// Додати новий пункт у групі товарів
	$(".newbie.btn.add-new-item").on("click", function (event) {
		$(event.target)
			.parent()
			.before(itemConstructor);
		addClickabilityToNewbie(itemConstructor);
	});
	// Додати, чи змінити ім'я групи товарів
	$(".btn.newbie.subtitute-group-name").on("click", function (event) {
		let temp = `<span>${$(event.target)
      .siblings('input[type="text"]')
      .val()}</span>`;
		$(event.target)
			.before(temp)
			.siblings('input[type="text"]')
			.remove();
		$(event.target).remove();
	});
	// Додати нову групу товарів
	$(".btn.newbie.add-new-goods-group").on("click", function (event) {
		let temp = `<li><input type="text" placeholder="Назва групи товарів"><button class="btn newbie subtitute-group-name">ok, хіба ні?</button><button class="btn newbie clear-from-page">Видалити групу товарів</button><ul><li id="add-new-item-item"><button class="btn newbie add-new-item">+ Одиниця з групи товарів</button></li></ul></li>`;
		$(event.target)
			.parent()
			.before(temp);
		addClickabilityToNewbie(itemConstructor);
	});

	$(".newbie").toggleClass("newbie");
}



function addEnteredToPage(clickEvent) {
	let newItem = "<li>";
	let isOk = true;

	//collect entered data in new <li> item
	$(clickEvent.target)
		.siblings('input[type="text"]')
		.map((index, elem) => {
			let temp = $(elem).val();
			//check isn't there any problems
			if (temp == "") {
				console.error(
					"Помилка у Введених даних \n Перевірте важливі поля на %c порожність",
					"background: #222; color:yellow"
				);
				isOk = false;
			} else if ($(elem).hasClass("price") && !$.isNumeric(temp)) {
				console.error(
					"Помилка у Введених данних \n Перевірте їх на %c логічність",
					"background: #222; color:yellow"
				);
				isOk = false;
			}
			temp = `<span class='${$(elem).attr("class")}'>${temp}</span><br>`;
			newItem += temp;
		});
	newItem +=
		'<button class="btn newbie clear-from-page">Видалити</button></li>';
	if (isOk) {
		$(clickEvent.target)
			.parent()
			.after(newItem);
		// $(clickEvent.target)
		//   .siblings()
		//   .val("");
		$(clickEvent.target)
			.parent()
			.remove();
	}
}



function fetchForDb(data) {
	// let response;
	data = JSON.stringify(data)
	let response = fetch(homeUrl, {
			method: "post",
			body: data
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
	return response
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


function insertGroupsByResponse(response) {
	console.log(response);

	let groupNames = []
	response.map((row) => {
		groupNames.push(row.group_name)
	})

	groupNames.unique().map((group_name) => {
		let temp = `<li id='group-${group_name}'><span>${group_name}</span><button class="btn newbie clear-from-page">Видалити групу товарів</button><ul><li id="add-new-item-item"><button class="btn newbie add-new-item">+ Одиниця з групи товарів</button></li></ul></li>`;
		$('.add-new-goods-group').parent().before(temp)
		addClickabilityToNewbie(itemConstructor);
	})
	return groupNames
}

// NOT WORKING1!!
function insertGoodsByResponse(response) {
	response.map((row) => {
		let groupSelector = `#group-${row.group_name}`
		let barToInsert = `<li><span>${row.name}</span><br><span>${row.price}</span><br>	<button class="btn newbie clear-from-page">Видалити</button></li>`
		$(groupSelector).children(".add-new-item").before(barToInsert)
	})

}


// copypasted from https://coderwall.com/p/nilaba/simple-pure-javascript-array-unique-method-with-5-lines-of-code
Array.prototype.unique = function () {
	return this.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});
}