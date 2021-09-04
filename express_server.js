const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    "id": "userRandomID",
    "email": "me@me.com",
    "password": "1234"
  },
  
  "user2RandomID": {
    "id": "user2RandomID",
    "email": "you@you.com",
    "password": "12345"
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  
  const templateVars = { 
    user: user
  };

  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  
  const templateVars = { 
    user: user
  };

  res.render("urls_login", templateVars);
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  
  const templateVars = { 
    urls: urlDatabase,
    user: user
  };
  
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  
  const templateVars = { 
    user: user
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: user
  };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});


app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email.length !== 0 && password.length !== 0 && checkEmail(email)) {
    const newUserID = generateRandomString();
  
    users[`${newUserID}`] = {
      "id": newUserID,
      "email": email,
      "password": password
    }
     
    res.cookie("user_id", newUserID);
  
    res.redirect("/urls");
  } else {
    res.sendStatus(400);
    console.log(res.statusCode)
  }
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };
  res.redirect(`/urls/${shortURL}`, templateVars);         
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };

  res.redirect("/urls", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  const user = users[req.cookies[user_id]];

  const templateVars = { 
    user: user
  };

  res.redirect("/urls", templateVars);
});

app.post("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const { email, password } = req.body;

  const templateVars = { 
    user: user
  };
  
  res.cookie("user_id", req.cookies["user_id"]);
  res.redirect("/urls", templateVars);
});

app.post("/logout", (req, res) => {
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };
  
  res.clearCookie("user_id");
  res.redirect("/urls", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  let shortURL = Math.round((Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6))).toString(36).slice(1);

  return shortURL;
}

function checkEmail(email) {
  for (const user in users) {
    if (users[user].email !== email) {
      return true;
    }
    return false;
  }
}