import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { getTestimonials } from '../../utils/api'

const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'Residential Client',
    rating: 5,
    review: 'SP Pest Control responded quickly and completely resolved our cockroach problem. Professional, thorough, and they explained everything clearly. Highly recommended.',
  },
  {
    id: 2,
    name: 'David Roets',
    location: 'Commercial Client',
    rating: 5,
    review: 'We use SP Pest Control for our warehouse and have been impressed throughout. Reliable, discreet, and the reporting after each visit helps with our compliance requirements.',
  },
  {
    id: 3,
    name: 'Priya Naidoo',
    location: 'Residential Client',
    rating: 5,
    review: 'Called for an urgent bed bug issue and they were available the following morning. Very thorough, excellent communication, and the problem was resolved completely.',
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials)

  useEffect(() => {
    getTestimonials()
      .then(res => { if (res.data.data.testimonials.length > 0) setTestimonials(res.data.data.testimonials) })
      .catch(() => {})
  }, [])

  return (
    <section className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">What Our Customers Say About SP Pest Control</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Real feedback from residential and commercial clients.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow border-l-4 border-l-green-500"
            >
              <div className="flex items-start justify-between mb-4">
                <StarRating rating={t.rating} />
                <Quote className="w-6 h-6 text-green-200 flex-shrink-0" />
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                </div>
                <div>
                  <div className="font-bold text-navy-900 text-sm">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
