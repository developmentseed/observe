export default function presetsObjectToArray (presetsObj) {
  return Object.keys(presetsObj).map((k) => {
    const preset = presetsObj[k]
    preset.key = k
    return preset
  })
}
