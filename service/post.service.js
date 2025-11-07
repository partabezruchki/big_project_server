const postModel = require("../models/post.model");
const fileService = require("../service/file.service");
const BaseError = require("../errors/baseError");

class PostService {
  async createPost(data, file, authorId) {
    if (!file) {
      throw BaseError.BadRequestError("File is required");
    }

    const fileName = fileService.saveFile(file);

    const newPost = await postModel.create({
      ...data,
      image: fileName,
      author: authorId,
    });
    return newPost;
  }
  async getAllPost() {
    const post = await postModel
      .find()
      .populate("author", "name image email _id")
      .sort({ createdAt: -1 });
    return post;
  }
  async deletePost(id) {
    const post = await postModel.findByIdAndDelete(id);
    if (!post) {
      console.log("Post not found");
      throw BaseError.BadRequestError("Post not found");
    }
    return post;
  }

  async updatePost(id, data) {
    const post = await postModel.findByIdAndUpdate(id, data, { new: true });
    if (!post) {
      console.log("Post not found");
      throw BaseError.BadRequestError("Post not found");
    }
    return post;
  }

  async getPostById(id) {
    const post = await postModel
      .findById(id)
      .populate("author", "name image email _id")
      .sort({ createdAt: -1 });
    if (!post) {
      console.log("Post not found");
      throw BaseError.BadRequestError("Post not found");
    }
    return post;
  }
}

module.exports = new PostService();
