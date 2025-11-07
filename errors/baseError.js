module.exports = class BaseError extends Error {
  status;
  errors;
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new BaseError(401, "Unauthorized");
  }

  static BadRequestError(message, errors = []) {
    return new BaseError(400, message, errors);
  }

//   static NotFoundError(message, errors = []) {
//     return new BaseError(404, message, errors);
//   }

//   static ForbiddenError(message, errors = []) {
//     return new BaseError(403, message, errors);
//   }

//   static InternalServerError(message, errors = []) {
//     return new BaseError(500, message, errors);
//   }

//   static ValidationError(message, errors = []) {
//     return new BaseError(400, message, errors);
//   }

//   static NotAcceptableError(message, errors = []) {
//     return new BaseError(406, message, errors);
//   }

//   static NotAllowedError(message, errors = []) {
//     return new BaseError(405, message, errors);
//   }

//   static NotSupportedError(message, errors = []) {
//     return new BaseError(415, message, errors);
//   }

//   static NotModifiedError(message, errors = []) {
//     return new BaseError(304, message, errors);
//   }

  

//   static NotFoundError(message, errors = []) {
//     return new BaseError(404, message, errors);
//   }

//   static NotExtendedError(message, errors = []) {
//     return new BaseError(304, message, errors);
//   }

};
