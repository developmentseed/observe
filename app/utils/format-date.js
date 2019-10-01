import moment from 'moment'

/**
 * @param {Number} date - date in ms from epoch
 */
export default function (timestamp) {
  return moment(timestamp).format('lll')
}
