if (window.location.search == "?fail=1") {
    let login_fail = document.createElement("P");
    login_fail.style = "color:red;";
    login_fail.innerHTML = "Wrong username or password!";
    document.body.appendChild(login_fail);
  }

  if (window.location.search == "?logout=True") {
    let logout_success = document.createElement("P");
    logout_success.style = "color:green;";
    logout_success.innerHTML = "Logout Success!";
    document.body.appendChild(logout_success);
  }