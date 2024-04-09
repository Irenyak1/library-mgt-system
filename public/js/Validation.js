const ValidUserForm = (event) => {
  // let err = 0;

  let userID = document.getElementById("userID");
  let fullName = document.getElementById("fullName");
  let email = document.getElementById("email");
  let mobileNumber = document.getElementById("mobileNumber");

  // Errors
  let userIDError = document.getElementById("userIDErr");
  let fullNameError = document.getElementById("fullNameErr");
  let emailError = document.getElementById("emailErr");
  let mobileNumberError = document.getElementById("mobileNumberErr");

  // let male = document.getElementById("male")
  // let role = document.getElementById("role")
  // let country = document.getElementById("count")
  // let city = document.getElementById("cit");
  // let password = document.getElementById("pass");

  // let roleError = document.getElementById("roleErr");
  // let imgError = document.getElementById("imgErr");
  // let countryError = document.getElementById("countryErr");
  // let cityError = document.getElementById("cityErr");

  if (userID.value == "") {
    firstname.style.border = "1px solid red";
    userIDError.textContent = "User Id can not be empty";
    userIDError.style =
      "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
    // err++;
    return false;
  }

  if (fullName.value == "") {
    firstname.style.border = "1px solid red";
    fullNameError.textContent = "Name can not be empty";
    fullNameError.style =
      "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
    // err++;
    return false;
  }

  if (email.value == "") {
    firstname.style.border = "1px solid red";
    emailError.textContent = "Email can not be empty";
    emailError.style =
      "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
    // err++;
    return false;
  }

  const emailregex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email.value.match(emailregex)) {
    email.style.border = "1px solid red";
    emailError.textContent = "please put in a correct email address";
    emailError.style =
      "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
    // alert("please put in a correct email address");
    // err++;
    return false;
  }

  if (mobileNumber.value == "") {
    firstname.style.border = "1px solid red";
    mobileNumberError.textContent = "Mobile number can not be empty";
    mobileNumberError.style =
      "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
    // err++;
    return false;
  }

  // if (firstname.value.length < 3) {
  //   firstname.style.border = "1px solid red"
  //   fnameError.textContent = "please the first name must be atleast 3 letters";
  //   fnameError.style = "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
  //   // alert("please the first name must be atleast 3 letters");
  //   return false;
  // }

  // if (lastname.value.length < 3) {
  //   lastname.style.border = "1px solid red"
  //   lnameError.textContent = "please the last name must be atleast 3 letters";
  //   lnameError.style = "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
  //   // alert("please the last name must be atleast 3 letters");
  //   return false;
  // }

  

  // if (female.checked == false && male.checked==false) {
  //   // if(!(female.checked && male.checked))
  //   genderError.textContent = "Please select gender";
  //   genderError.style = "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
  //   // alert("please select gender");
  //   return false;
  // }

  // if (role.value == "Default") {
  //   // alert("please select a city");
  //   role.style.border = "1px solid red"
  //   roleError.textContent = "Please select a role";
  //   roleError.style = "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
  //   return false;
  // }

  // if (country.value.length < 2) {
  //   country.style.border = "1px solid red"
  //   countryError.textContent = "Please fill in a country name with more than 2 characters";
  //   countryError.style = "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
  //   // alert("Please fill in a country name with more than 2 characters");
  //   return false;
  // }

  // if (city.value == "Default") {
  //   // alert("please select a city");
  //   city.style.border = "1px solid red"
  //   cityError.textContent = "Please select a city";
  //   cityError.style = "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
  //   return false;
  // }

  // if (password.value.length < 5) {
  //   alert("please password must be at least 5 characters");
  //   return false;
  // }

  // if (err >= 1) {
  //   event.preventDefault();
  // }
};
