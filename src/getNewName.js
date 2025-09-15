const changeCase = require('./changeCase')
const getModelResponse = require('./getModelResponse')

/**
 * Gets a new name for a file from the model.
 * @param {object} options - The options for getting the new name.
 * @param {string} options._case - The case style to use for the new name.
 * @param {number} options.chars - The maximum number of characters for the new name.
 * @param {string} options.content - The content of the file.
 * @param {string} options.language - The language to use for the new name.
 * @param {string} options.videoPrompt - The prompt for a video file.
 * @param {string} options.customPrompt - A custom prompt to add to the request.
 * @param {string} options.relativeFilePath - The relative path to the file.
 * @returns {Promise<string|undefined>} The new name for the file, or undefined if an error occurs.
 */
module.exports = async options => {
  const { _case, chars, content, language, videoPrompt, customPrompt, relativeFilePath } = options

  try {
    const promptLines = [
      'Generate filename:',
      '',
      `Use ${_case}`,
      `Max ${chars} characters`,
      `${language} only`,
      'No file extension',
      'No special chars',
      'Only key elements',
      'One word if possible',
      'Noun-verb format',
      '',
      'Respond ONLY with filename.'
    ]

    if (videoPrompt) {
      promptLines.unshift(videoPrompt, '')
    }

    if (content) {
      promptLines.push('', 'Content:', content)
    }

    if (customPrompt) {
      promptLines.push('', 'Custom instructions:', customPrompt)
    }

    const prompt = promptLines.join('\n')

    const modelResult = await getModelResponse({ ...options, prompt })

    const maxChars = chars + 10
    const text = modelResult.trim().slice(-maxChars)
    const filename = await changeCase({ text, _case })
    return filename
  } catch (err) {
    console.log(`🔴 Model error: ${err.message} (${relativeFilePath})`)
  }
}
