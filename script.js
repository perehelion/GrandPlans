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