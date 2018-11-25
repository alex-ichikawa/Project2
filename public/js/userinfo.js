
$(document).on("click", "#signmeup", function(event) {
    event.preventDefault();
    
    if (!$("#inputEmail").val().trim() || !$("#inputPassword").val().trim() || !$("#firstName").val().trim() || !$("#lastName").val().trim()) {
        
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'Complete all fields',
          });
          return;
    }   
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
        // console.log(`response is ${response.email}`);
        if(response) {
            
            swal({
                title: 'Email already exists! Login or enter a different email',
                animation: true,
                customClass: 'animated tada'
                
                
              })
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
                    let baseurl = window.location.origin;
                     window.location.replace(`${baseurl}/signin`);
                      
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
            currentUser = {
                id: response.id,
                firstName: response.firstName,
                lastName: response.lastName
            }

            let baseurl = window.location.origin;
            window.location.replace(`${baseurl}/home/${response.id}/${response.firstName}`);
            
             }

    });
});
