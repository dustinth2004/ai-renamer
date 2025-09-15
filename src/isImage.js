/**
 * Checks if a file extension is an image type.
 * @param {object} params - The parameters for checking the file type.
 * @param {string} params.ext - The file extension.
 * @returns {boolean} True if the file extension is an image type, false otherwise.
 */
module.exports = ({ ext }) => {
  const imageTypes = ['.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff']
  return imageTypes.includes(ext)
}
