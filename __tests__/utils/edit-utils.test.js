/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import { getAllRetriable } from '../../app/utils/edit-utils'
import { getFeature } from '../test-utils'
import { EDIT_PENDING_STATUS } from '../../app/constants'

const mockFeature1 = getFeature('node/1')

test('get all retryable edits', () => {
  const edits = [
    {
      'type': 'create',
      'newFeature': mockFeature1,
      'oldFeature': null,
      'comment': 'Test',
      'id': 'node/observe-vfxnxtmo20j',
      'status': EDIT_PENDING_STATUS,
      'errors': [],
      'timestamp': 1562325975841
    },
    {
      'type': 'modify',
      'newFeature': mockFeature1,
      'oldFeature': mockFeature1,
      'comment': 'Test',
      'id': 'node/observe-vfxnxtmo20j',
      'status': EDIT_PENDING_STATUS,
      'errors': [{
        'code': 'VersionMismatchError',
        'extra': 'Version mismatch: Provided 1, server had: 2 of Node 1',
        'message': 'This feature has been updated since you edited it',
        'retryable': false
      }],
      'timestamp': 1562325975841
    },
    {
      'type': 'modify',
      'newFeature': mockFeature1,
      'oldFeature': mockFeature1,
      'comment': 'Test',
      'id': 'node/observe-vfxnxtmo20j',
      'status': EDIT_PENDING_STATUS,
      'errors': [{
        'code': 'UploadNetworkError',
        'extra': '',
        'message': 'Network error while uploading changes',
        'retryable': true
      }],
      'timestamp': 1562325975841
    }
  ]
  expect(getAllRetriable(edits)).toMatchSnapshot()
})
