/*
The error will be created in the errorHandler, express wil catch 
it in the app.use(erroMiddleware) statement which will direct it here.
basically, factoring the errors in some meeaningfull displayable response.
*/

const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  (err.status = err.status || 500),
    (err.message = err.message || "Internal Server Error");
  
  //Mongodb CastError (wrong ID error)
  // if (err.name == "CastError"){
  //   const message =  `Resource not found . Invalid ${err.path}`
  //   err = new ErrorHandler(message,400);
  // }

  //Mongoose duplicate key error
  if(err.code === 11000){
    const message = `Duplicate Credentials Entered`
    err = new ErrorHandler(message,400);
  }

  //Wromg JWT error
  if(err.code === "JsonWebTokenError"){
    const message = `Json Web Token is invalid, try again`
    err = new ErrorHandler(message,400);
  }

  //JWT Expire error
  if(err.code === "TokenExpireError"){
    const message = `Json Web Token is Expired, try again`
    err = new ErrorHandler(message,400);
  }
  
  res.status(err.status||500).json({
    success: false,
    message: err.message,
    stack:err.stack
  });
};
