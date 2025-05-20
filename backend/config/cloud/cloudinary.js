const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY } = require("../../utils/variables");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET_KEY,
});
/*
async function deleteEmptyFolders(parentFolder) {
  const emptyFolders = [];

  try {
    // Retrieve a list of all folders within the parent folder
    const foldersResponse = await cloudinary.api.sub_folders(parentFolder);

    if (foldersResponse.folders) {
      for (const folder of foldersResponse.folders) {
        // Check if the folder is empty
        const resourcesResponse = await cloudinary.api.resources({
          type: "upload",
          prefix: folder.name,
        });

        if (resourcesResponse.resources.length === 0) {
          // Folder is empty, add it to the list for deletion
          emptyFolders.push(folder.name);
        } else {
          // If the folder is not empty, recursively check its subfolders
          await deleteEmptyFolders(folder.name);
        }
      }
    }
  } catch (error) {
    console.error("Error retrieving folders:", error.message);
  }

  // Delete the empty folders after the traversal
  for (const folderName of emptyFolders) {
    try {
      await cloudinary.api.delete_folder(folderName);
      console.log(`Deleted empty folder: ${folderName}`);
    } catch (deleteError) {
      console.error(`Error deleting folder: ${folderName}`, deleteError.message);
    }
  }
}
*/

async function deleteEmptyFolder(folderPath) {
  try {
    await cloudinary.api.delete_folder(folderPath);
    console.log(`Deleted folder: ${folderPath}`);
  } catch (error) {
    console.error(`Error deleting folder ${folderPath}: ${error.message}`);
  }
}

// Recursive function to delete empty folders
async function deleteEmptyFolders(rootFolder) {
  try {
    const subfolders = await cloudinary.api.sub_folders(rootFolder);

    for (const subfolder of subfolders.folders) {
      await deleteEmptyFolders(subfolder.path);
    }

    if (subfolders.folders.length === 0) {
      // If there are no subfolders, this folder is empty, delete it.
      await deleteEmptyFolder(rootFolder);
    }
  } catch (error) {
    console.error(`Error processing folder ${rootFolder}: ${error.message}`);
  }
}

module.exports = {
  deleteEmptyFolders,
};
// Specify the parent folder where you want to delete empty folders
// setInterval(() => deleteEmptyFolders(parentFolder), 24 * 60 * 60 * 1000); // 24 hours in milliseconds
