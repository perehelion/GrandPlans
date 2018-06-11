const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const xlsx = require('xlsx')
require('dotenv').config();

function send404(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    response.write('Error 404: Resource not found.');
    console.log(`${new Date().getHours()}:${new Date().getMinutes()}  just sent err404`);
}

var mimeLookup = {
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
};

var server = http.createServer(function (req, res) {
    new Promise(resolve => {
        if (req.method == 'GET') {
            let fileurl;
            if (req.url == '/') {
                fileurl = './index.html';
            } else {
                fileurl = req.url;
            }

            // splitting way to file:
            var filepath = path.resolve('./' + fileurl);
            // extracting extension(e.g. .html .css)
            var fileExt = path.extname(filepath);
            var mimeType = mimeLookup[fileExt];

            if (!mimeType) {
                mimeType = 'text/plain'
                var urlObj = url.parse(req.url, true);
                res.writeHead(200, {
                    'Content-Type': mimeType
                });
                for (const query in urlObj.query) {
                    switch (query) {
                        case "table":
                            res.writeHead(200, {
                                'Content-Type': mimeType
                            });
                            fs.readFile('/home/inperegelion/projects/GrandPlans/other/sample.xls', (err, data) => {
                                data = new Uint8Array(data)
                                var data = xlsx.read(data, {
                                    type: 'array'
                                })
                                var htmlstr = xlsx.write(data, {
                                    sheet: 'фотодрук',
                                    type: 'binary',
                                    bookType: 'html',
                                })
                                res.write(htmlstr)
                            })

                            break;
                        default:
                            console.log(`${new Date().getHours()}:${new Date().getMinutes()}  unknown query`);
                            break;
                    }
                }

                console.log(`${new Date().getHours()}:${new Date().getMinutes()}  just answered on fetch`);
                return;
            }

            fs.exists(filepath, function (exists) {
                if (!exists) {
                    send404(res);
                    return;
                };
                res.writeHead(200, {
                    'content-type': mimeType
                });
                fs.createReadStream(filepath).pipe(res);
                console.log(`${new Date().getHours()}:${new Date().getMinutes()}  just sent a ${req.url}`);
            });
        }
    }).then(() => {
        res.end()
    })
}).listen(process.env.PORT);


console.log(`server running ${process.env.PORT}`);