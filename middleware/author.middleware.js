const BaseError = require("../errors/baseError");
const postModel = require("../models/post.model");

const authorMiddleware = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return next(BaseError.BadRequestError("Post not foundd"));
    }
    // console.log(post.author.toString(), req.user.id.toString());

    if (post.author.toString() !== req.user.id.toString()) {
      return next(
        BaseError.BadRequestError(
          "faqat o'zingiz yaratgan postni o'zgartirish imkoni mavjudd"
        )
      );
    }

    next();
  } catch (error) {
    return next(
      BaseError.BadRequestError(
        "faqat o'zingiz yaratgan postni o'zgartirish imkoni mavjud"
      )
    );
  }
};

module.exports = authorMiddleware;
