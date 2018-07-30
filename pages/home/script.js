const apikey = "AIzaSyA7CgFfRqztZypbB9PzbZ2Hl5xGoCNCgEg";

function initMap() {
    let uluru = {
        lat: 49.239121,
        lng: 28.501235
    };
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: uluru
    });
    let marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

function pigmantate() {
    $("body")
        .find("*")
        .each(function () {
            $(this).css({
                "background-color": "rgb(" +
                    Math.floor(Math.random() * 155 + 100).toString() +
                    ", " +
                    Math.floor(Math.random() * 155 + 100).toString() +
                    ", " +
                    Math.floor(Math.random() * 155 + 100).toString() +
                    ")"
            });
        })
};
$(document).ready(function () {
    pigmantate();
});



let url = "http://localhost:8085"
fetch(url, {
    method: 'post',
    body: JSON.stringify({
        age: 20
    })
}).then((answer) => {
    var reader = answer.body.getReader().read().then((done, value) => {
        console.log(new TextDecoder("utf-8").decode(done.value));
    })
})