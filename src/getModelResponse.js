const fs = require('fs')
const axios = require('axios')

/**
 * Gets the model response from the Ollama API.
 * @param {object} params - The parameters for the API call.
 * @param {string} params.model - The model to use.
 * @param {string} params.prompt - The prompt to send to the model.
 * @param {Array<string>} params.images - A list of paths to images to send to the model.
 * @param {string} params.baseURL - The base URL of the Ollama API.
 * @returns {Promise<string>} The response from the model.
 */
const ollamaApis = async ({ model, prompt, images, baseURL }) => {
  try {
    const url = `${baseURL}/api/generate`

    const data = {
      model,
      prompt,
      stream: false
    }

    if (images && images.length > 0) {
      data.images = await Promise.all(images.map(async imagePath => {
        const imageData = await fs.promises.readFile(imagePath)
        return imageData.toString('base64')
      }))
    }

    const apiResult = await axios({
      url,
      data,
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    })

    return apiResult.data.response
  } catch (err) {
    throw new Error(err?.response?.data?.error?.message || err?.response?.data?.error || err.message)
  }
}

/**
 * Gets the model response from the OpenAI or LM Studio API.
 * @param {object} params - The parameters for the API call.
 * @param {string} params.model - The model to use.
 * @param {string} params.prompt - The prompt to send to the model.
 * @param {Array<string>} params.images - A list of paths to images to send to the model.
 * @param {string} params.apiKey - The API key for the OpenAI API.
 * @param {string} params.baseURL - The base URL of the OpenAI or LM Studio API.
 * @returns {Promise<string>} The response from the model.
 */
const openaiApis = async ({ model, prompt, images, apiKey, baseURL }) => {
  try {
    const url = `${baseURL}/v1/chat/completions`

    const data = {
      model,
      stream: false
    }

    const messages = [{
      role: 'user',
      content: [
        { type: 'text', text: prompt }
      ]
    }]

    if (images && images.length > 0) {
      for (const imagePath of images) {
        const imageData = await fs.promises.readFile(imagePath)
        messages[0].content.push({
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${imageData.toString('base64')}` }
        })
      }
    }

    data.messages = messages

    const apiResult = await axios({
      url,
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` })
      }
    })

    return apiResult.data.choices[0].message.content
  } catch (err) {
    throw new Error(err?.response?.data?.error?.message || err?.response?.data?.error || err.message)
  }
}

/**
 * Gets the model response from the specified provider.
 * @param {object} options - The options for getting the model response.
 * @param {string} options.provider - The provider to use (ollama, openai, lm-studio).
 * @returns {Promise<string>} The response from the model.
 */
module.exports = async options => {
  try {
    const { provider } = options

    if (provider === 'ollama') {
      return ollamaApis(options)
    } else if (provider === 'openai' || provider === 'lm-studio') {
      return openaiApis(options)
    } else {
      throw new Error('🔴 No supported provider found')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}
