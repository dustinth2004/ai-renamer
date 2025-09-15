const path = require('path')
const pdf = require('pdf-parse')
const fs = require('fs').promises

/**
 * Reads the content of a file. It can read text files and PDF files.
 * @param {object} params - The parameters for reading the file.
 * @param {string} params.filePath - The path to the file.
 * @returns {Promise<string>} The content of the file.
 */
module.exports = async ({ filePath }) => {
  try {
    const ext = path.extname(filePath).toLowerCase()

    let content = ''
    if (ext === '.pdf') {
      const dataBuffer = await fs.readFile(filePath)
      const pdfData = await pdf(dataBuffer)
      content = pdfData.text.trim()
    } else {
      content = fs.readFile(filePath, 'utf8')
    }

    return content
  } catch (err) {
    throw new Error(err.message)
  }
}
