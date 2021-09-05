const bcrypt = require('bcrypt');

const generateRandomString = function() {
  let shortURL = Math.round((Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6))).toString(36).slice(1);

  return shortURL;
}

const checkEmail = function(email, users) {
  for (const user in users) {
    if (users[user].email !== email) {
      return true;
    }
    return false;
  }
}

const authenticaeUser = function(email, password, users) {
  for (const user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].password)) {
      return user;
    }
  }
  return null;
}

const urlsForUser = function(id, urlDatabase) {
  const userURLsObj = {};
  
  for (const shortURL in urlDatabase) {

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

const verifyUser = function(id, urlDatabase) { 

  for (const shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].userID) {
      return true;
    }
  }
  return false; 
}

const getUserByEmail = function(email, users) {
  // lookup magic...
  return user;
};

module.exports = {
  generateRandomString,
  checkEmail,
  authenticaeUser,
  urlsForUser,
  verifyUser,
  getUserByEmail
};