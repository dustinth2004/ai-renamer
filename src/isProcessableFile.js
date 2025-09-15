const path = require('path')

const supportedExtensions = require('./supportedExtensions')

/**
 * Checks if a file is processable based on its extension.
 * @param {object} params - The parameters for checking the file.
 * @param {string} params.filePath - The path to the file.
 * @returns {boolean} True if the file is processable, false otherwise.
 */
module.exports = ({ filePath }) => {
  const ext = path.extname(filePath).toLowerCase()
  return supportedExtensions.includes(ext)
}
