const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": { "longURL":"http://www.lighthouselabs.ca" },
  "9sm5xK": { "longURL": "http://www.google.com" }
};

const users = {
  "userRandomID": {
    "id": "userRandomID",
    "email": "me@me.com",
    "password": "123"
  },
  
  "user2RandomID": {
    "id": "user2RandomID",
    "email": "you@you.com",
    "password": "1234"
  },

  "user3RandomID": {
    "id": "user3RandomID",
    "email": "hola@hola.com",
    "password": "12345"
  },

  "user4RandomID": {
    "id": "user4RandomID",
    "email": "yeh@yeh.com",
    "password": "123456"
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
  const id = user.id;
  console.log(id);

  const urls = urlsForUser(id);

  const templateVars = { 
    user: user,
    urls: urls
  };
  //templateVars["shortURL"] = "";
  //templateVars["urls"] = {};
  
 
  //console.log(shortURL)
  //console.log(urlDatabase[shortURL])


  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  
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
  const user = users[req.cookies["user_id"]];

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
  urlDatabase[shortURL] = {
    "longURL": req.body.longURL,
    "userID": req.cookies["user_id"]
  };

  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };
  res.redirect(`/urls/${shortURL}`);         
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };

  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  const user = users[req.cookies["user_id"]];

  const templateVars = { 
    user: user
  };

  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const validUser = authenticaeUser(email, password);

  if(validUser) {
    res.cookie("user_id", users[validUser].id);
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }
});

app.post("/logout", (req, res) => {
  //const user = users[req.cookies["user_id"]];
  
  res.clearCookie("user_id");
  res.redirect("/login");
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

function authenticaeUser(email, password) {
  for (const user in users) {
    if (users[user].email === email && users[user].password === password) {
      return user;
    }
  }
  return null;
}

function urlsForUser(id) {
  const userURLsObj = {};
  
  for (const shortURL in urlDatabase) {
    
    console.log(shortURL)
    console.log(urlDatabase[shortURL])

    if (id === urlDatabase[shortURL].userID) {
      userURLsObj[shortURL] = {
        "shortURL": shortURL,
        "longURL": urlDatabase[shortURL].longURL,
        "userID": urlDatabase[shortURL].userID
      };

      return userURLsObj;
    }
  }
  return null; 
}