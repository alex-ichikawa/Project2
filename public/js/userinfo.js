
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
    // $("#errMsg").text("")
    console.log("In login ______-------")
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
        if (response.user == false) {
            
                swal({
                    title: 'Incorrect username or password',
                    animation: true,
                    customClass: 'animated tada'
                    
                    
                  })
            }
           
      
        
        else {
            swal({
                title: 'Login successful',
                animation: true,
                customClass: 'animated tada'
                
                
              })
                 currentUser = {
                    id: response.user.id,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName
                 }
                //  console.log("------------------", response);

            let baseurl = window.location.origin;

            
            window.location.replace(`${baseurl}/home/${currentUser.id}/${currentUser.firstName}`);
           

            
             }

    });
});

$(document).on("click", "#signout", function(event) {
    event.preventDefault();

    $.ajax({
        method: "GET",
        url: "/api/logout",
        
    })
    .then(function(response){
    // alert("signed out");
        window.location = '/';
        console.log(response);
    });
});