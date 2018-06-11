const homeURL = 'http://localhost:8085/'
const tableQueryURL = "http://localhost:8085/?table=фотодрук"

fetch(tableQueryURL, (response) => {
	return response
}).then((res) => {
	var reader = res.body.getReader().read().then((done, value) => {
		$('div').html(new TextDecoder("utf-8").decode(done.value))
	})
});


$(document).ready(function () {
	console.log('jq is ready');
	// $('div').html(table)
});