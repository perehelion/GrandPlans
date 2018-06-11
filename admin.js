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

function plugButtons() {}

$(function() {
  pigmantate();
  let $constructor = $("#new-goods-constructor").clone(true);
  // $('#new-goods-constructor').remove();

  $("#add-new-goods").on("click", function() {
    $("#add-new-goods-item").before($constructor.clone(true));
  });

  $("#new-goods-apply").on("click", function() {
    let enteredData = [];
    let lol = 0;
    $(this)
      .siblings()
      .find("input")
      .map((index, element) => {
        console.log($element.val());
        lol++;
      });
    // .map((index, $element) => {
    // 	enteredData.push($element.val());
    // 	console.log($element.val());
    // 	lol++;
    // });
    console.log(lol);

    let $myFrame = $("#myFrame").clone(true);
    $myFrame.attr("id", "temproary");
    console.log($myFrame);

    $(this)
      .parent()
      .after('<li id="new-item"></li>');
    $("#new-item").append($myFrame);
    // $myFrame.find('#name').text($(this).siblings().find('#new-goods-name').val())

    $(this)
      .parent()
      .remove();
  });
});
