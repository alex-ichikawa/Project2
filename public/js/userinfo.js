
$(document).on("click", "#signmeup", function(event) {
    event.preventDefault();
    $("#msg").text("");
    var emailInput = $("#inputEmail").val().trim();
    var pass = $("#inputPassword").val().trim();
    console.log(`password etred ${pass}`)
    var newUSer = {
        firstName: $("#firstName").val().trim(),
        lastName: $("#lastName").val().trim(),
        email: $("#inputEmail").val().trim(),
        password: $("#inputPassword").val().trim()
    };
    $("#firstName").val("");
    $("#lastName").val("");
    $("#inputEmail").val("");
    $("#inputPassword").val("");

    console.log(`this is new user ${newUSer}`);
    $.ajax({
        method: "POST",
        url: "/api/checkemail",
        data: newUSer
    })
    .then(function(response){
        console.log(`response is ${response}`);
        if(response) {
            
$("#msg").append("Email already exists! Enter a different email or login");
        }

        else    {
            console.log("We are going to creata a new user");

            // create new user 
            {
                $.ajax("/api/createuser", {
                    method: "POST",
                    data: newUSer
                  }).then(function(){
                      console.log("Added new user");

                      
                  });
            }
        }
    });
 

});

//validating user login
$(document).on("click", "#login", function(event) {
    event.preventDefault();
    $("#errMsg").text("")
    let emailCheck = $("#inputEmail").val().trim();
    let passwordCheck = $("#inputPassword").val().trim();
   
    var checkUser = {
        email: emailCheck,
        password: passwordCheck
    }
    $("#inputEmail").val("");
    $("#inputPassword").val("");

    $.ajax({
        method: "POST",
        url: "/api/authenticate",
        data: checkUser
    })
    .then(function(response){
        console.log(`response is ${response}`);
        if (!response) {
            $("#errMsg").append("Incorrect user name or password. Try again!");
           
        //    having troublr 
            // window.location.pathname= "/";
        }
        else {
            $("#errMsg").append(`Success! Welcome ${response.firstName} ${response.lastName}`);   
             }

    });
});
