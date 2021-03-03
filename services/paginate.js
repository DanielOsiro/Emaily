const mongoose = require("mongoose");

module.exports = async (model, page, limit) => {
  const Collection = mongoose.model(model);
  const skip = page * limit - limit;
  const totalPages = Math.ceil((await Collection.countDocuments()) / limit);
  page = page > totalPages ? totalPages : page;

  return { page, skip, totalPages };
};
