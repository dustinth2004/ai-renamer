#!/usr/bin/env node

const processPath = require('./processPath')
const configureYargs = require('./configureYargs')

/**
 * The main function of the application.
 * It configures yargs, gets the input path, and processes it.
 * @returns {Promise<void>}
 */
const main = async () => {
  try {
    const { argv, config } = await configureYargs()
    const [inputPath] = argv._

    if (!inputPath) {
      console.log('🔴 Please provide a file or folder path')
      process.exit(1)
    }

    await processPath({ ...config, inputPath })
  } catch (err) {
    console.log(err.message)
  }
}

main()
