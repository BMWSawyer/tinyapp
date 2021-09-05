// Requiring dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const {
  generateRandomString,
  checkEmail,
  authenticaeUser,
  urlsForUser,
  verifyUser
} = require("./helpers");

// Setting the PORT
const PORT = 8080; // default port 8080

// Setting the view engine and the use of body-parser and cookie-session
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['my-secret-key']
}));

// Creating the empty url and users databases
const urlDatabase = { };
const users = { };


// GET routes
app.get("/", (req, res) => {
  const user = users[req.session["user_id"]];
  
  const templateVars = {
    user: user
  };
  
  res.render("urls_register", templateVars);
});

app.get("/register", (req, res) => {
  const user = users[req.session["user_id"]];
  
  const templateVars = {
    user: user
  };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.session["user_id"]];
  
  const templateVars = {
    user: user
  };

  res.render("urls_login", templateVars);
});

app.get("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  const id = user.id;

  const urls = urlsForUser(id, urlDatabase);

  const templateVars = {
    user: user,
    urls: urls
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]];
  
  if (!user) {
    res.redirect("/login");
  
  } else {
    const templateVars = {
      user: user
    };
  
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session["user_id"]];

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: user
  };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  
  res.redirect(longURL);
});

// POST routes
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email.length !== 0 && password.length !== 0 && checkEmail(email, users)) {
    const newUserID = generateRandomString();
    const securePassword = bcrypt.hashSync(password, 10);
    
    users[`${newUserID}`] = {
      "id": newUserID,
      "email": email,
      "password": securePassword
    };
     
    req.session["user_id"] = newUserID;
    res.redirect("/urls");
  
  } else {
    res.sendStatus(400);
    console.log(res.statusCode);
  }
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
 
  urlDatabase[shortURL] = {
    "longURL": req.body.longURL,
    "userID": req.session["user_id"]
  };

  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session["user_id"]];
  const id = user.id;

  if (verifyUser(id, urlDatabase)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  
  } else {
    res.sendStatus(403);
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const user = users[req.session["user_id"]];
  const id = user.id;

  if (verifyUser(id, urlDatabase)) {
    urlDatabase[req.params.shortURL].longURL = req.body.newURL;
    res.redirect("/urls");
  
  } else {
    res.sendStatus(403);
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  const validUser = authenticaeUser(email, password, users);

  if (validUser) {
    req.session["user_id"] = users[validUser].id;
    res.redirect("/urls");
  
  } else {
    res.sendStatus(403);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// Server listening at PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});