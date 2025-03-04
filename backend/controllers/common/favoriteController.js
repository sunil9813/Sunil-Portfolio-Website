const asyncHandler = require("express-async-handler");
const { mongoose } = require("mongoose");
const FavoriteModel = require("../../models/common/favoriteModel");

const toggleFavorite = asyncHandler(async (req, res) => {
  const resourceId = req.body.resourceId;
  const resourceType = req.body.resourceType;

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    return res.status(422).json({ error: "Resource id is invalid!" });
  }

  // Check if the resource type is valid
  if (!["Posts", "Courses", "Blog", "Chapter"].includes(resourceType)) {
    return res.status(422).json({ error: "Invalid resource type!" });
  }

  try {
    const resourceModel = mongoose.model(resourceType);
    const resource = await resourceModel.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found!" });
    }

    let favorite = await FavoriteModel.findOne({ owner: req.user.id, itemType: resourceType });

    if (!favorite) {
      // Create a new favorite list if it doesn't exist for the resource type
      favorite = await FavoriteModel.create({ owner: req.user.id, items: [resourceId], itemType: resourceType });
    } else {
      const existingIndex = favorite.items.indexOf(resourceId);

      if (existingIndex !== -1) {
        // Resource is already in favorites, so we want to remove it
        favorite.items.splice(existingIndex, 1);
        await favorite.save();

        // Remove the user's ID from the likes array in the resource
        resource.likes.pull(req.user.id);
        await resource.save();

        return res.json({ status: "removed" });
      } else {
        // Resource is not in favorites, so we want to add it
        favorite.items.push(resourceId);
        await favorite.save();
      }
    }

    // Add the user's ID to the likes array in the resource
    resource.likes.addToSet(req.user.id);
    await resource.save();

    return res.json({ status: "added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred." });
  }
});

const getUserFavorite = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { limit = "20", pageNo = "0" } = req.query;

  try {
    const favorites = await FavoriteModel.aggregate([
      {
        $match: { owner: userId },
      },
      {
        $group: {
          _id: "$itemType",
          items: { $push: "$items" },
        },
      },
    ]);

    const favoritesByItemType = {};

    for (const favorite of favorites) {
      const itemType = favorite._id;
      const items = favorite.items[0]; // Since we pushed items as an array

      // Create a query to find items of the specific itemType
      const itemModel = mongoose.model(itemType);
      const itemsData = await itemModel.find({ _id: { $in: items } });

      favoritesByItemType[itemType] = itemsData;
    }

    return res.json(favoritesByItemType);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred while fetching favorites" });
  }
});

module.exports = {
  toggleFavorite,
  getUserFavorite,
};
