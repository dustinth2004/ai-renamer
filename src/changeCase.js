/**
 * Changes the case of a string.
 * @param {object} params - The parameters for changing the case.
 * @param {string} params.text - The text to change the case of.
 * @param {string} params._case - The case style to use.
 * @returns {Promise<string>} The text with the new case style.
 */
module.exports = async ({ text, _case }) => {
  const changeCase = await import('change-case')

  try {
    return changeCase[_case](text)
  } catch (err) {
    return changeCase.kebabCase(text)
  }
}
