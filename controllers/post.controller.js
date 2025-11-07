const postService = require("../service/post.service");

class PostController {
  async createPost(req, res, next) {
    try {
      const data = req.body;
      let file;
      if (req.files) {
        file = req.files;
      }
      const newPost = await postService.createPost(
        data,
        file?.image,
        req.user.id
      );
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }
  async getPost(req, res, next) {
    try {
      const post = await postService.getAllPost();
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
  async deletePost(req, res, next) {
    try {
      const post = await postService.deletePost(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
  async updatePost(req, res, next) {
    try {
      const post = await postService.updatePost(req.params.id, req.body);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
  async getPostById(req, res, next) {
    try {
      const post = await postService.getPostById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
