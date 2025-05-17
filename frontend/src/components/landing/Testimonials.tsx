export default function Testimonials() {
  const testimonials = [
    {
      name: 'Ahmed Hassan',
      title: 'Property Buyer',
      image: '/images/testimonial-1.jpg',
      quote: 'BigDealEgypt helped me find the perfect apartment in New Cairo. The cashback was a great bonus!',
    },
    {
      name: 'Fatima El-Sayed',
      title: 'First-time Homeowner',
      image: '/images/testimonial-2.jpg',
      quote: 'The property matching system is amazing. It found exactly what I was looking for within my budget.',
    },
    {
      name: 'Omar Mahmoud',
      title: 'Real Estate Investor',
      image: '/images/testimonial-3.jpg',
      quote: 'As an investor, I appreciate the direct connection to sellers and the streamlined process.',
    },
  ]

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            What Our Customers Say
          </p>
        </div>
        
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  {/* Replace with actual Image component when you have real images */}
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{testimonial.title}</p>
                </div>
              </div>
              <blockquote>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}