const fs = require('fs')


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

	console.log(htmlstr);
})
/*
$('#input-excel').change(function (e) {
	var reader = new FileReader();
	reader.readAsArrayBuffer(e.target.files[0]);

	reader.onload = function (e) {
		var data = new Uint8Array(reader.result);
		var wb = XLSX.read(data, {
			type: 'array'
		});

		var htmlstr = XLSX.write(wb, {
			sheet: "sheet no1",
			type: 'binary',
			bookType: 'html'
		});
		$('#wrapper')[0].innerHTML += htmlstr;
	}
});
*/