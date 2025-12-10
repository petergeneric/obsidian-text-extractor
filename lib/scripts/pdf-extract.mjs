#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

;(async args => {
  const pdfPath = resolve(args[0])

  if (!pdfPath) {
    console.error('Missing required param: pdfPath')
    process.exit(1)
  }

  const resolvedPath = resolve(pdfPath)

  // Load the WASM module
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const wasm = await import(
    join(__dirname, '../pkg-node/obsidian_text_extract.js')
  )

  try {
    // Read the PDF file
    const pdfData = await readFile(resolvedPath)
    const pdfArray = new Uint8Array(pdfData)

    // Extract text by page
    const pages = wasm.extract_pdf_text_by_pages(pdfArray)

    // Emit a markdown-esque document
    pages.forEach((text, i) => {
      console.log(`# Page ${i + 1}^page=${i + 1}`)
      console.log()
      console.log(text)
      console.log()
    })
  } catch (err) {
    console.error('Error extracting text:', err.message)
    process.exit(1)
  }
})(process.argv.slice(2))
