const bcrypt = require('bcrypt');

const generateRandomString = function() {
  // I found the logic for the random string generator at https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript/22028809
  // After I found it I made sure to research and read each method I didn't know about so that I understood everything that was happening before adding it in.
  let shortURL = Math.round((Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6))).toString(36).slice(1);

  return shortURL;
}

const checkEmail = function(email, users) {
  for (const user in users) {
    if (users[user].email !== email || users === undefined) {
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
    } else {
      return null;
    }
  }
  return userURLsObj; 
}

const verifyUser = function(id, urlDatabase) { 

  for (const shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].userID) {
      return true;
    }
  }
  return false; 
}

// This function is not used in the main project and is only here for the mocha and chai testing assignment
const getUserByEmail = function(email, usersDatabase) {
  for (const user in usersDatabase) {
    if(usersDatabase[user].email === email){
      return usersDatabase[user].id;
    }
  }
  return undefined;
};

module.exports = {
  generateRandomString,
  checkEmail,
  authenticaeUser,
  urlsForUser,
  verifyUser,
  getUserByEmail
};