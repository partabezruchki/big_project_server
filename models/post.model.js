const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
