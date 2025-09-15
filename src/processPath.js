const fs = require('fs').promises

const processFile = require('./processFile')
const chooseModel = require('./chooseModel')
const processDirectory = require('./processDirectory')

/**
 * Processes the given path, which can be a file or a directory.
 * @param {object} params - The parameters for processing the path.
 * @param {string} params.inputPath - The path to the file or directory.
 * @param {string} params.defaultCase - The default case style.
 * @param {string} params.defaultModel - The default model to use.
 * @param {number} params.defaultChars - The default number of characters for the new name.
 * @param {number} params.defaultFrames - The default number of frames to extract from videos.
 * @param {string} params.defaultApiKey - The default API key.
 * @param {string} params.defaultBaseURL - The default base URL for the API.
 * @param {string} params.defaultLanguage - The default language for the new name.
 * @param {string} params.defaultProvider - The default provider.
 * @param {string} params.defaultCustomPrompt - The default custom prompt.
 * @param {boolean} params.defaultIncludeSubdirectories - Whether to include subdirectories.
 * @returns {Promise<void>}
 */
module.exports = async ({
  inputPath,
  defaultCase,
  defaultModel,
  defaultChars,
  defaultFrames,
  defaultApiKey,
  defaultBaseURL,
  defaultLanguage,
  defaultProvider,
  defaultCustomPrompt,
  defaultIncludeSubdirectories
}) => {
  try {
    const provider = defaultProvider || 'ollama'
    console.log(`⚪ Provider: ${provider}`)

    const apiKey = defaultApiKey
    if (apiKey) {
      console.log('⚪ API key: **********')
    }

    let baseURL = defaultBaseURL
    if (provider === 'ollama' && !baseURL) {
      baseURL = 'http://127.0.0.1:11434'
    } else if (provider === 'lm-studio' && !baseURL) {
      baseURL = 'http://127.0.0.1:1234'
    } else if (provider === 'openai' && !baseURL) {
      baseURL = 'https://api.openai.com'
    }
    console.log(`⚪ Base URL: ${baseURL}`)

    const model = defaultModel || await chooseModel({ baseURL, provider })
    console.log(`⚪ Model: ${model}`)

    const frames = defaultFrames || 3
    console.log(`⚪ Frames: ${frames}`)

    const _case = defaultCase || 'kebabCase'
    console.log(`⚪ Case: ${_case}`)

    const chars = defaultChars || 20
    console.log(`⚪ Chars: ${chars}`)

    const language = defaultLanguage || 'English'
    console.log(`⚪ Language: ${language}`)

    const includeSubdirectories = defaultIncludeSubdirectories === 'true' || false
    console.log(`⚪ Include subdirectories: ${includeSubdirectories}`)

    const customPrompt = defaultCustomPrompt || null
    if (customPrompt) {
      console.log(`⚪ Custom Prompt: ${customPrompt}`)
    }

    console.log('--------------------------------------------------')

    const stats = await fs.stat(inputPath)
    const options = {
      model,
      _case,
      chars,
      frames,
      apiKey,
      baseURL,
      language,
      provider,
      inputPath,
      includeSubdirectories,
      customPrompt
    }

    if (stats.isDirectory()) {
      await processDirectory({ options, inputPath })
    } else if (stats.isFile()) {
      await processFile({ ...options, filePath: inputPath })
    }
  } catch (err) {
    console.log(err.message)
  }
}
