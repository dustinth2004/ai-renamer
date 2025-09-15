const fs = require('fs')
const path = require('path')

/**
 * Deletes a directory and all its contents recursively.
 * @param {object} params - The parameters for deleting the directory.
 * @param {string} params.folderPath - The path to the directory to delete.
 * @returns {void}
 */
const deleteDirectory = ({ folderPath }) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory({ folderPath: curPath })
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folderPath)
  }
}

module.exports = deleteDirectory
