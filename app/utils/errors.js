import serializeError from 'serialize-error'

export class ObserveError extends Error {
  /**
   * @param {String} code - default is 'ObserveError'
   * @param {String} message
   * @param {String / Error} extra - can either be a string or an Error instance
   */
  constructor (code = 'ObserveError', message, extra) {
    super(message)
    this.code = code
    this.retryable = false
    this.extra = extra
  }

  // Returns a JSON serializable representation of the error
  toJSON () {
    return {
      code: this.code,
      message: this.message,
      retryable: this.retryable,
      extra: this.extra instanceof Error ? serializeError(this.extra) : this.extra
    }
  }
}

export class UploadNetworkError extends ObserveError {
  constructor (message = 'Network error while uploading changes', extra) {
    super('UploadNetworkError', message, extra)
    this.retryable = true
  }
}

export class AuthError extends ObserveError {
  constructor (message = 'There was a problem authenticating the request', extra) {
    super('AuthError', message, extra)
    this.retryable = true
  }
}

export class ChangesetParseError extends ObserveError {
  constructor (message = 'Error parsing Changeset XML while uploading', extra) {
    super('ChangesetParseError', message, extra)
    this.retryable = false
  }
}

export class ChangesetNotFoundError extends ObserveError {
  constructor (message = 'Changeset not found', extra) {
    super('ChangesetNotFoundError', message, extra)
    this.retryable = false
  }
}

export class UnknownServerError extends ObserveError {
  constructor (message = 'An unknown server error occurred', extra) {
    super('UnknownServerError', message, extra)
    this.retryable = false
  }
}

export class VersionMismatchError extends ObserveError {
  constructor (message = 'This feature has been updated since you edited it', extra) {
    super('VersionMismatchError', message, extra)
    this.retryable = false
  }
}

export class OsmChangeError extends ObserveError {
  constructor (message = 'Error parsing OSM Change XML on the server', extra) {
    super('OsmChangeError', message, extra)
    this.retryable = false
  }
}

export class FeatureNotFoundError extends ObserveError {
  constructor (message = 'This feature is not found on OSM', extra) {
    super('FeatureNotFoundError', message, extra)
    this.retryable = false
  }
}

export class FeatureDeletedError extends ObserveError {
  constructor (message = 'This feature is deleted', extra) {
    super('FeatureDeletedError', message, extra)
    this.retryable = false
  }
}
