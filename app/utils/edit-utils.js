import { UploadNetworkError } from './errors'

/**
 * Given an edit, says if the edit can be retried based on the error type
 * @param {Object} edit
 * @returns {Boolean} - true if retryable, false if not
 */
export function isRetryable (edit) {
  return getError(edit).retryable
}

/**
 * For an array of edit objects, returns a filtered list of retriable edits
 * @param {Array<Object>} edits - array of edit objects
 * @returns {Array<Object>}
 */
export function getAllRetriable (edits) {
  return edits.filter(e => isRetryable(e))
}

/**
 * Given an edit, returns whether it has a Version Conflict error
 * @param {Object} edit
 * @returns {Boolean}
 */
export function isConflict (edit) {
  return getError(edit).code === 'VersionMismatchError'
}

/**
 * Return the applicable / current error for an edit.
 * If it has errors, return the last error in the error.
 * If it does not have errors, we assume that it is waiting for network, and return a NetworkError
 * @param {Object} edit - edit object
 * @return {ObserveError} - an instance of ObserveError, with the error for the edit
 */
export function getError (edit) {
  return edit.errors.length > 0 ? edit.errors.slice(-1)[0] : new UploadNetworkError()
}

export function getErrorExtra (edit) {
  return getError(edit).extra
}
