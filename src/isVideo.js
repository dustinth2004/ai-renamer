/**
 * Checks if a file extension is a video type.
 * @param {object} params - The parameters for checking the file type.
 * @param {string} params.ext - The file extension.
 * @returns {boolean} True if the file extension is a video type, false otherwise.
 */
module.exports = ({ ext }) => {
  const videoTypes = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm']
  return videoTypes.includes(ext.toLowerCase())
}
