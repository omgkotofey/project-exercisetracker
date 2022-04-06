class APIError {
  constructor(status = 400, message = 'Something went wrong') {
    this.message = message;
    this.status = status;
  }

  toString() {
    return {
      status: this.status,
      message: this.message,
    }
  }
}


const errorHandler = (err, req, res, next) => {
  let customError = err;

  if (!(err instanceof APIError)) {
    customError = new APIError(400);
  }

  console.error(err);
  res.status(customError.status).json(customError);
}

module.exports = {
  APIError: APIError, 
  errorHandler: errorHandler
}