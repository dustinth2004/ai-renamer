const path = require('path')
const fs = require('fs').promises

const processFile = require('./processFile')

/**
 * Processes a directory, recursively processing files and subdirectories.
 * @param {object} params - The parameters for processing the directory.
 * @param {object} params.options - The options for processing files.
 * @param {string} params.inputPath - The path to the directory.
 * @returns {Promise<void>}
 */
const processDirectory = async ({ options, inputPath }) => {
  try {
    const files = await fs.readdir(inputPath)
    for (const file of files) {
      const filePath = path.join(inputPath, file)
      const fileStats = await fs.stat(filePath)
      if (fileStats.isFile()) {
        await processFile({ ...options, filePath })
      } else if (fileStats.isDirectory() && options.includeSubdirectories) {
        await processDirectory({ options, inputPath: filePath })
      }
    }
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = processDirectory
