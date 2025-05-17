'use client'

export default function RequestStatusHistory({ statusHistory, formatDate }) {
  if (statusHistory.length === 0) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Status History
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>No status updates have been recorded yet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Status History
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>History of status changes for this property request.</p>
        </div>
        <div className="mt-4 flow-root">
          <ul className="-mb-8">
            {statusHistory.map((status, statusIdx) => (
              <li key={status.id}>
                <div className="relative pb-8">
                  {statusIdx !== statusHistory.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                          ${status.new_status === 'pending' ? 'bg-yellow-100' : 
                          status.new_status === 'active' ? 'bg-green-100' : 
                          'bg-gray-100'}`}
                      >
                        <svg
                          className={`h-5 w-5 
                            ${status.new_status === 'pending' ? 'text-yellow-600' : 
                            status.new_status === 'active' ? 'text-green-600' : 
                            'text-gray-600'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Status changed to{' '}
                          <span className="font-medium text-gray-900">
                            {status.new_status.charAt(0).toUpperCase() + status.new_status.slice(1)}
                          </span>
                          {status.old_status && (
                            <>
                              {' '}from{' '}
                              <span className="font-medium text-gray-900">
                                {status.old_status.charAt(0).toUpperCase() + status.old_status.slice(1)}
                              </span>
                            </>
                          )}
                        </p>
                        {status.notes && (
                          <p className="mt-1 text-sm text-gray-500">
                            {status.is_private && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                                Private
                              </span>
                            )}
                            {status.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={status.created_at}>
                          {formatDate(status.created_at)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}