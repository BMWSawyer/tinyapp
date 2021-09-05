# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). The web application will allow users to register for an account, it will keep track of their shortened URLs and even after logging out and then back in again they will still have access the URLs that they shortened.

## Final Product

These are three screenshots of the web application in use. The first is the user registration page, the second is the URLs list page, and the third is the individual URL/URL edit page.

!["Screenshot of user registration page"](https://github.com/BMWSawyer/tinyapp/blob/master/docs/register-page.png?raw=true)
!["Screenshot of user urls page"](https://github.com/BMWSawyer/tinyapp/blob/master/docs/urls-page.png?raw=true)
!["Screenshot of user url-show/url-edit page"](https://github.com/BMWSawyer/tinyapp/blob/master/docs/urlshow-edit-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- cookie-parser

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Have fun with creating shortened URLs and navigating the web application.
- Try logging out and then logging back in again to confirm your shortened URLs are still available to you.