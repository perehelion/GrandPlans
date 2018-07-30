function htmlGenerator(key, arg) {
	if (arg == undefined) {
		switch (key) {
			case 'constructor':
				return `<li>
			<span>Нова одиниця товару</span>  <br>  
			<input class="name" type="text" placeholder="Назва товару">  <br>  
			<input class="price" type="text" placeholder="Ціна">  <br>  
			<label>Картинка: </label>  <input type="file">  <br>  
			<button class="btn newbie add-to-page">Встромити в сторінку</button>  <button class="btn newbie clear-from-page">Скасувати ввід</button>
			</li>`;

			case 'blank group':
				return `<li>
			<input type="text" placeholder="Назва групи товарів">
			<button class="btn newbie subtitute-group-name">ok?(Затвердити)</button>
			<button class="btn newbie clear-from-page">Видалити групу товарів</button>
			<ul><li class="add-new-item-item"><button class="btn newbie add-new-item">+ Одиниця з групи товарів</button></li></ul>
			</li>`;

			case '':
				return

		}
	} else {
		switch (key) {
			case 'add group':
				return `<li id='group-${arg[0]}'> 
				<span>${arg[1]}</span><button class='btn newbie edit-group-name'>Редагуватоньки назву групи</button><button class="btn newbie clear-from-page">Видалити групу товарів</button>
				<ul><li class="add-new-item-item"><button class="btn newbie add-new-item">+ Одиниця з групи товарів</button></li></ul>
				</li>`;
			case 'add item':
				return `<li>
				<span>${arg[0]}</span><br><span>${arg[1]}</span><br>
				<button class="btn newbie clear-from-page">Видалити</button>
				</li>`
			default:
				break;
		}
	}

}


function addClickabilityToNewbie() {
	// Встромити в сторінку уведений товар
	$(".newbie.btn.add-to-page").on("click", function (event) {
		addEnteredToPage(event);
		addClickabilityToNewbie();
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
			.before(htmlGenerator('constructor'));
		addClickabilityToNewbie();
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
		$(event.target)
			.parent()
			.before(htmlGenerator('blank group'));
		addClickabilityToNewbie();
	});
	// Редагувати назву групи
	$('.btn.newbie.edit-group-name').on('click', function (event) {
		let temp = `<input type="text" placeholder="${$(event.target).siblings('span').text()}">
								<button class="btn add-new-group-name">Встромити в сторінку</button>`;
		$(event.target).siblings('span').before(temp);
		$(event.target).siblings('span').remove();
		$(event.target).siblings('.btn.add-new-group-name').on('click', (ev) => {
			let tempSpan = `<span>${$(ev.target).siblings('input[type="text"]').val()}</span><button class='btn newbie edit-group-name'>Редагуватоньки назву групи</button>`;
			$(ev.target).before(tempSpan);
			$(ev.target).siblings('input[type="text"]').remove();
			$(ev.target).remove();
		});
		$(event.target).remove();
		addClickabilityToNewbie()
	})

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
		'<button class="btn newbie edit-item">Редагуватоньки</button> \
		<button class="btn newbie clear-from-page">Видалити</button></li>';
	if (isOk) {
		$(clickEvent.target)
			.parent()
			.after(newItem);
		$(clickEvent.target)
			.parent()
			.remove();
	}
}



function fetchForDb(data) {
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
		$('.add-new-goods-group')
			.parent()
			.before(htmlGenerator('add group', [group_name, group_name]))
		addClickabilityToNewbie();
	})
	return groupNames
}


function insertGoodsByResponse(response) {
	response.map((row) => {
		let groupSelector = `#group-${row.group_name} > ul > li > .add-new-item`
		let barToInsert = `<li><span>${row.name}</span><br><span>${row.price}</span><br>
		<button class="btn newbie edit-item">Редагуватоньки</button>
		<button class="btn newbie clear-from-page">Видалити</button></li>`
		htmlGenerator('add item', [row.name, row.price, ])
		$(groupSelector).parent().before(barToInsert)
	})

}


// copypasted from https://coderwall.com/p/nilaba/simple-pure-javascript-array-unique-method-with-5-lines-of-code
Array.prototype.unique = function () {
	return this.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});
}