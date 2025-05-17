import { FaCashRegister, FaSearchLocation, FaCalendarCheck, FaUserShield } from 'react-icons/fa'

export default function Features() {
  const features = [
    {
      name: 'Cashback',
      description: 'Get % of your property purchase price back in cash after successful purchase.',
      icon: FaCashRegister,
    },
    {
      name: 'Personalized Matching',
      description: 'Our system matches your specific requirements with available properties.',
      icon: FaSearchLocation,
    },
    {
      name: 'Direct Scheduling',
      description: 'Schedule property viewings directly through our platform.',
      icon: FaCalendarCheck,
    },
    {
      name: 'Privacy Protected',
      description: 'Your contact information remains private until you decide to view a property.',
      icon: FaUserShield,
    },
  ]

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A Better Way to Buy Property
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Cut out the middleman and get rewarded for your property purchase.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}