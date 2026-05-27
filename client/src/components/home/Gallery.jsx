import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Home, Building2, CheckCircle, Star, Award } from 'lucide-react'
import { getGallery } from '../../utils/api'

const placeholders = [
  { icon: Shield, label: 'Residential Treatment', color: 'from-navy-900 to-navy-800' },
  { icon: Home, label: 'Home Pest Control', color: 'from-green-800 to-green-700' },
  { icon: Building2, label: 'Commercial Service', color: 'from-slate-700 to-slate-600' },
  { icon: CheckCircle, label: 'Cockroach Control', color: 'from-navy-800 to-navy-700' },
  { icon: Star, label: 'Safe Treatments', color: 'from-green-700 to-green-600' },
  { icon: Award, label: 'Professional Results', color: 'from-slate-800 to-slate-700' },
]

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGallery()
      .then(res => setImages(res.data.data.images))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hasImages = images.length > 0

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Our Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Service Quality You Can Trust</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Professional pest control across Brakpan homes and businesses.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {!loading && hasImages
            ? images.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                  className="relative group rounded-2xl overflow-hidden aspect-square bg-slate-100"
                >
                  <img
                    src={`http://localhost:5000/uploads/${image.filename}`}
                    alt={image.alt_text || image.title || 'Jb Pest Control service'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {image.featured === 1 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">Featured</div>
                  )}
                  {image.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-semibold">{image.title}</p>
                    </div>
                  )}
                </motion.div>
              ))
            : placeholders.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br ${color} flex flex-col items-center justify-center group cursor-pointer`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white/80 text-sm font-semibold text-center px-4">{label}</p>
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  )
}
