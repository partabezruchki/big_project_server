const BaseError = require("../errors/baseError");

module.exports = (err, req, res, next) => {
  console.log(err);

  if (err instanceof BaseError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Internal Server Error" });
};
