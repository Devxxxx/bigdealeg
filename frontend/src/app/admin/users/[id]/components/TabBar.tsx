'use client'

type TabBarProps = {
  activeTab: 'profile' | 'activity' | 'properties' | 'requests'
  setActiveTab: (tab: 'profile' | 'activity' | 'properties' | 'requests') => void
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  return (
    <div className="border-t border-gray-200">
      <nav className="-mb-px flex" aria-label="Tabs">
        <button
          className={`${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`${
            activeTab === 'activity'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button
          className={`${
            activeTab === 'properties'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`${
            activeTab === 'requests'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </button>
      </nav>
    </div>
  )
}
