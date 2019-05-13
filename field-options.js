/**
 * Script to add value options to all presets without default values. This is limited to combo fields at the moment
 * This script is part of `yarn build-presets`
 */

const request = require('request')
const fs = require('fs')
const prettyStringify = require('json-stringify-pretty-compact')

const fields = JSON.parse(fs.readFileSync('app/presets/fields.json', { encoding: 'utf-8' }))
const tasks = []

Object.keys(fields.fields).forEach(key => {
  const field = fields.fields[key]
  if (field.type === 'combo' && (!field.options && !field.strings)) {
    console.error('Preparing field options for key:', field.key)

    tasks.push(getValuesFromTaginfo(field.key)
      .then(response => {
        const options = []
        response.data.forEach((d) => {
          options.push(d.value)
        })
        field.options = options
      })
      .catch(err => {
        console.error(err)
      }))
  }
})

Promise.all(tasks)
  .then(() => {
    fs.writeFileSync('app/presets/fields.json', prettyStringify(fields, { maxLength: 9999 }), { encoding: 'utf8', flag: 'w' })
  })
  .catch(err => {
    console.error(err)
  })

function getValuesFromTaginfo (key) {
  const url = 'https://taginfo.openstreetmap.org/api/4/key/values?lang=en&page=1&query=&rp=25&sortname=count_ways&sortorder=desc&key=' + key
  return new Promise((resolve, reject) => {
    request.get(url, (err, response, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}
