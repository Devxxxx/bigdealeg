'use client'

import { FaSave, FaTimesCircle } from 'react-icons/fa'

export default function StatusUpdateForm({
  request,
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  isPrivateNote,
  setIsPrivateNote,
  handleStatusUpdate,
  isUpdatingStatus,
  updateError
}) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Update Request Status
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Change the status of this property request and add notes for the customer or your team.
          </p>
        </div>
        <form onSubmit={handleStatusUpdate} className="mt-5">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Status Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Add notes about this status change..."
              />
            </div>
            <div className="sm:col-span-6">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="private-note"
                    name="private-note"
                    type="checkbox"
                    checked={isPrivateNote}
                    onChange={(e) => setIsPrivateNote(e.target.checked)}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="private-note" className="font-medium text-gray-700">
                    Private Note
                  </label>
                  <p className="text-gray-500">This note will only be visible to the sales team, not the customer.</p>
                </div>
              </div>
            </div>
          </div>

          {updateError && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaTimesCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{updateError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5">
            <button
              type="submit"
              disabled={isUpdatingStatus}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isUpdatingStatus ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="-ml-1 mr-2 h-4 w-4" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}