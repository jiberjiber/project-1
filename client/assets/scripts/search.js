const dogAPIKey = "e5a7d34e-abed-4bdf-80e2-2f1fd529fa6d";

function getBreeds() {
  $.ajax({
    url: `https://api.thedogapi.com/v1/breeds?api_key= + ${dogAPIKey}`,
    method: "GET",
  }).then(function (response) {
    for (let i = 0; i < response.length; i++) {
      let option = $("<option>");
      option.attr("value", response[i].name);
      option.text(response[i].name);

      $("#pet-breed").append(option);
    }
    //Set default value
    $("#pet-breed").val("Cardigan Welsh Corgi");
  });
}

//Get pet based on user-input

$("#petSearchForm").on("submit", (event) => {
  event.preventDefault();

  let queryURL = "http://localhost:8080/pets/search";
  $.ajax(queryURL, {
    method: "GET",
    data: {
      petBreed: $("#pet-breed").val(),
      petGender: $("#pet-gender").val(),
      petAge: $("#pet-age").val(),
      petSize: $("#pet-size").val(),
    },
  })
    .then(function (data) {

      let resultsContainer = $("#allUsers");
      //Clear contents of the allUsers div
      $(resultsContainer).empty();
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].petName);
        let petMatch = data[i].petName;
        let petOwner = data[i].UserId;
        let ownerName = data[i].username;
        console.log("WHO OWNS THIS DOG???", petOwner, ownerName);
        let result = $("<div>");
        let link = $(`<a href="/profile/${data[i].UserId}" />`).addClass(
          "cell users searchRes"
        );

        let userName = $("<h5>").addClass("user-name");
        let profileBtn = $("<button>")
          .attr({
            type: "button",
            class: "button small primary",
          })
          .text("View profile!");
        $(result).append(userName, profileBtn);
        $(userName).text(petMatch);
        $(result).wrap(`<a href="/profile/${data[i].UserId}" />`);
        $(link).append(result);
        $(resultsContainer).append(link);

      }
    })
    .catch((err) => console.log(err));
});

getBreeds();

