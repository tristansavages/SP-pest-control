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
  const displayImages = !loading && hasImages
    ? images.map((image) => ({
        id: image.id,
        src: getImageSrc(image.filename),
        label: image.title || 'Jb Pest Control service',
        alt: image.alt_text || image.title || 'Jb Pest Control service',
        featured: image.featured === 1,
      }))
    : stockImages.gallery

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {displayImages.map(({ id, src, label, alt, featured }, i) => (
            <motion.div
              key={id || label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
              className={`relative rounded-2xl overflow-hidden bg-slate-100 group ${
                i === 0 ? 'lg:col-span-6 lg:row-span-2 aspect-[4/3] lg:aspect-auto min-h-[22rem]' : 'lg:col-span-3 aspect-square'
              }`}
            >
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent" />
              {(featured || i === 0) && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
                  Featured
                </div>
              )}
              <p className="absolute inset-x-0 bottom-0 p-4 text-white text-sm sm:text-base font-semibold">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
