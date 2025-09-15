const axios = require('axios')

/**
 * Fetches the available models from the Ollama API.
 * @param {object} params - The parameters for the API call.
 * @param {string} params.baseURL - The base URL of the Ollama API.
 * @returns {Promise<Array<object>>} A list of available models.
 */
const ollamaApis = async ({ baseURL }) => {
  try {
    const apiResult = await axios({
      data: {},
      method: 'get',
      url: `${baseURL}/api/tags`
    })

    return apiResult.data.models
  } catch (err) {
    throw new Error(err?.response?.data?.error || err.message)
  }
}

/**
 * Fetches the available models from the LM Studio API.
 * @param {object} params - The parameters for the API call.
 * @param {string} params.baseURL - The base URL of the LM Studio API.
 * @returns {Promise<Array<object>>} A list of available models.
 */
const lmStudioApis = async ({ baseURL }) => {
  try {
    const apiResult = await axios({
      data: {},
      method: 'get',
      url: `${baseURL}/v1/models`
    })

    return apiResult.data.data
  } catch (err) {
    throw new Error(err?.response?.data?.error || err.message)
  }
}

/**
 * Lists the available models from the specified provider.
 * @param {object} options - The options for listing the models.
 * @param {string} options.provider - The provider to use (ollama, lm-studio, openai).
 * @returns {Promise<Array<object>>} A list of available models.
 */
const listModels = async options => {
  try {
    const { provider } = options

    if (provider === 'ollama') {
      return ollamaApis(options)
    } else if (provider === 'lm-studio') {
      return lmStudioApis(options)
    } else if (provider === 'openai') {
      return [
        { name: 'gpt-4o' },
        { name: 'gpt-4' },
        { name: 'gpt-3.5-turbo' }
      ]
    } else {
      throw new Error('🔴 No supported provider found')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

/**
 * Filters the model names from the raw API response.
 * @param {Array<object>} arr - The array of models from the API.
 * @returns {Array<object>} A list of models with a 'name' property.
 */
const filterModelNames = arr => {
  return arr.map((item) => {
    if (item.id !== undefined) {
      return { name: item.id }
    } else if (item.name !== undefined) {
      return { name: item.name }
    } else {
      throw new Error('Item does not contain id or name property')
    }
  })
}

/**
 * Chooses a model from the list of available models based on a preferred list.
 * @param {object} params - The parameters for choosing a model.
 * @param {Array<object>} params.models - The list of available models.
 * @returns {string|null} The name of the chosen model, or null if no suitable model is found.
 */
const chooseModel = ({ models }) => {
  const preferredModels = [
    'llava',
    'llama',
    'gemma',
    'phi',
    'qwen',
    'aya',
    'mistral',
    'mixtral',
    'deepseek-coder'
  ]

  for (const modelName of preferredModels) {
    if (models.some(model => model.name.toLowerCase().includes(modelName))) {
      return models.find(model => model.name.toLowerCase().includes(modelName)).name
    }
  }

  return models.length > 0 ? models[0].name : null
}

/**
 * The main function to choose a model. It lists, filters, and selects a model.
 * @param {object} options - The options for choosing a model.
 * @returns {Promise<string>} The name of the chosen model.
 */
module.exports = async options => {
  try {
    const _models = await listModels(options)
    const models = filterModelNames(_models)
    console.log(`⚪ Available models: ${models.map(m => m.name).join(', ')}`)

    const model = await chooseModel({ models })
    if (!model) throw new Error('🔴 No suitable model found')

    return model
  } catch (err) {
    throw new Error(err.message)
  }
}
