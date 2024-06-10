const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publication_year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Library =
  mongoose.models.Library || mongoose.model("Library", librarySchema);

module.exports = Library;
