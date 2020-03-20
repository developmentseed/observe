const fs = require('fs')

const [filepath, filename] = process.argv.slice(2)

const content = JSON.stringify({
  images: [
    {
      idiom: 'universal',
      scale: '1x'
    },
    {
      idiom: 'universal',
      scale: '2x'
    },
    {
      idiom: 'universal',
      filename: filename,
      scale: '3x'
    }
  ],
  info: {
    version: 1,
    author: 'xcode'
  }
})

fs.writeFileSync(filepath, content)
