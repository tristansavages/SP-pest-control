import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getGallery } from '../../utils/api'
import { stockImages } from '../../constants/stockImages'

const getImageSrc = (filename) => {
  if (!filename) return ''
  if (filename.startsWith('http')) return filename
  return `/uploads/${filename}`
}

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
                    src={getImageSrc(image.filename)}
                    alt={image.alt_text || image.title || 'Jb Pest Control service'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
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
            : stockImages.gallery.map(({ src, label, alt }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                  className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 group"
                >
                  <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-navy-900/10 to-transparent" />
                  <p className="absolute inset-x-0 bottom-0 p-4 text-white text-sm font-semibold">{label}</p>
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  )
}
