const Uservalid = () => {
    const userID = document.getElementById("userID");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const mobileNumber = document.getElementById("mobileNumber");
  
    // Errors
    const userIDError = document.getElementById("userIDErr");
    const fullNameError = document.getElementById("fullNameErr");
    const emailError = document.getElementById("emailErr");
    const mobileNumberError = document.getElementById("mobileNumberErr");
  
    if (userID.value =="") {
      userID.style.border = "1px solid red";
      userIDError.textContent = "User Id can not be empty";
      userIDError.style =
        "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
      return false;
    }
    else {
      userID.style.border = "1px solid green";
      userIDError.textContent = ""
  }
  
    if (fullName.value == "") {
      fullName.style.border = "1px solid red";
      fullNameError.textContent = "Name can not be empty";
      fullNameError.style =
        "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
      return false;
    }
    else {
      fullName.style.border = "1px solid green";
      fullNameError.textContent = ""
  }
    const emailregex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.value == "") {
      email.style.border = "1px solid red";
      emailError.textContent = "Email can not be empty";
      emailError.style =
        "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
      return false;
    }
    else if (!email.value.match(emailregex)) {
      email.style.border = "1px solid red";
      emailError.textContent = "please put in a correct email address";
      emailError.style =
        "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
      return false;
    }
    else {
      email.style.border = "1px solid green";
      emailError.textContent = ""
  }
  
    if (mobileNumber.value == "") {
      mobileNumber.style.border = "1px solid red";
      mobileNumberError.textContent = "Mobile number can not be empty";
      mobileNumberError.style =
        "color: red; font-size:11px; font-family:Arial, Helvetica, sans-serif;";
      return false;
    }
    else {
      mobileNumber.style.border = "1px solid green";
      mobileNumberError.textContent = ""
  }
  };
  