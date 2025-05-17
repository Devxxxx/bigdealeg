'use client'

type TabBarProps = {
  activeTab: 'profile' | 'notifications' | 'security'
  setActiveTab: (tab: 'profile' | 'notifications' | 'security') => void
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex" aria-label="Tabs">
        <button
          className={`${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`${
            activeTab === 'notifications'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </nav>
    </div>
  )
}
