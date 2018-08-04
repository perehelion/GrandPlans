const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const mysql = require("mysql");



var mimeLookup = {
	".js": "application/javascript",
	".html": "text/html",
	".css": "text/css",
	".jpg": "image/jpeg"
};

function send404(response, request) {
	response.writeHead(404, {
		"Content-Type": "text/plain"
	});
	response.write("Error 404: Resource not found.");
	console.info(
		`${new Date().getHours()}:${new Date().getMinutes()}  just sent err404 on ${
      request.url
    }`
	);
}

function queryGenerator(mode, table, arr = new Object()) {
	if (arr.id == undefined) {
		arr.id = "NULL";
	}
	if (arr.mother == undefined) {
		arr.mother == "NULL";
	}

	switch (mode) {
		case "read":
			return `SELECT * FROM ${table}`;

		case "add":
<<<<<<< HEAD
			if (table == 'goods' || table == 'services') {
				return `INSERT INTO ${table} (name, notes, group_name, img_adress) VALUES \
							('${arr.name}',${arr.notes},'${arr.group_name}, ${arr.img_adress}')`;
			} else if (table == 'todos') {
				return `INSERT INTO ${table} (name, notes, img_adress) VALUES \
							('${arr.name}',${arr.notes}, ${arr.img_adress}')`;
			} else if (table == 'news') {
				return `INSERT INTO ${table} (title, content, img_adress) VALUES \
							('${arr.title}',${arr.content}, ${arr.img_adress}')`;
			}

=======
			return `INSERT INTO goods (name, notes, group_name) VALUES \
							('${arr.name}',${arr.notes},'${arr.group_name}')`;
							
>>>>>>> d63e37a618f44aabaf3520338b1bad3a61a53d82
		case "edit":
			let temp = '';
			if (arr.new.name != undefined) {
				temp += `UPDATE ${table} SET name = ${arr.new.name}\
					WHERE id = ${arr.id} OR name = '${arr.name}';`
			};
			if (arr.new.img_adress != undefined) {
				temp += `UPDATE ${table} SET img_adress = ${arr.new.img_adress}\
					WHERE id = ${arr.id} OR name = '${arr.name}';`
			};
			if (arr.new.notes != undefined) {
				temp += `UPDATE ${table} SET img_adress = ${arr.new.notes}\
					WHERE id = ${arr.id} OR name = '${arr.name}';`
			};
			if (arr.new.price_coins != undefined) {
				temp += `UPDATE ${table} SET img_adress = ${arr.new.price_coins}\
					WHERE id = ${arr.id} OR name = '${arr.name}';`
			};
			if (arr.new.title != undefined) {
				temp += `UPDATE ${table} SET name = ${arr.new.title}\
					WHERE id = ${arr.id} OR name = '${arr.name}';`
			};
			if (arr.new.content != undefined) {
				temp += `UPDATE ${table} SET name = ${arr.new.content}\
					WHERE id = ${arr.id} OR name = '${arr.name}';`
			}
			if (temp == '') {
				return queryGenerator('read')
			} else return temp

		case "delete":
			return `DELETE FROM ${table} WHERE name = \ 
			'${arr.name}' OR id = ${arr.id} OR group_name = '${arr.group_name}'`;

		default:
			return queryGenerator("read");
	}
}

var connectionToDB = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
})
connectionToDB.connect((err) => {
	if (err) throw err;
	console.log(`${new Date().getHours()}:${new Date().getMinutes()}  just connected to DB`);
})

var server = http
	.createServer(function (req, res) {
		new Promise(resolve => {
			if (req.url == "/favicon.ico") {
				send404(res, req);
				return;
			}

			if (req.method == "GET") {
				let fileurl;
				if (req.url == "/") {
					fileurl = "./pages/home/index.html";
				} else {
					fileurl = req.url;
				}

				var filepath = path.resolve("./" + fileurl);
				var fileExt = path.extname(filepath);
				var mimeType = mimeLookup[fileExt];

				fs.exists(filepath, function (exists) {
					if (!exists) {
						send404(res, req);
						return;
					}
					res.writeHead(200, {
						"content-type": mimeType
					});
					fs.createReadStream(filepath).pipe(res);
					console.log(
						`${new Date().getHours()}:${new Date().getMinutes()}  just sent a ${fileurl}`
					);
				});
			}

			if (req.method == "POST") {
				let body = "";
				req.on("data", data => {
					body += data;
				});
				req.on("end", () => {
					body = JSON.parse(body);
					connectionToDB.query(queryGenerator(body.mode,body.table, body.arr), (err, result) => {
						if (err) {
							res.writeHead(200, {
								"content-type": "text/plain"
							});
							res.write(JSON.stringify("some error happen ask Serhii'co to solve it"));
							console.error(
								`${new Date().getHours()}:${new Date().getMinutes()}  just sent error message on DB request: ${err}`
							);
						} else {
							res.writeHead(200, {
								"content-type": "application/json"
							});
							res.write(JSON.stringify(result));
							console.info(
								`${new Date().getHours()}:${new Date().getMinutes()}  just sent res of db query`
							);
						}
					})
				});
			}
		}).then(() => {
			res.end();
		});
	})
	.listen(process.env.PORT);

console.info(
	`${new Date().getHours()}:${new Date().getMinutes()}  server running ${
    process.env.PORT
  }`
);
