import LRU from 'lru-cache'
import sizeof from 'object-sizeof'

export default new LRU({
  length: (val, key) => sizeof(val),
  max: 5e6, // 5MB
  maxAge: 3600e3 // 1 hour
})
