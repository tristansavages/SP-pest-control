const pexels = (id, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`

export const stockImages = {
  hero: pexels(19789837, 1920),
  emergency: pexels(35303785, 1600),
  about: pexels(19789837, 1200),
  services: {
    'cockroach-control': pexels(6526933, 800),
    'ant-control': pexels(11997005, 800),
    'rodent-rat-control': pexels(95399, 800),
    'termite-treatment': pexels(35303785, 800),
    'bed-bug-treatment': pexels(35303785, 800),
    'flea-treatment': pexels(19789837, 800),
    'spider-control': pexels(5422599, 800),
    'general-pest-control': pexels(35303785, 800),
    'residential-pest-control': pexels(19789837, 800),
    'commercial-pest-control': pexels(35303785, 800),
  },
  gallery: [
    {
      src: pexels(19789837, 1000),
      label: 'Residential Treatment',
      alt: 'Pest control technician fogging a residential outdoor area',
    },
    {
      src: pexels(35303785, 1000),
      label: 'Professional Fumigation',
      alt: 'Pest control worker in protective gear applying treatment',
    },
    {
      src: pexels(6526933, 1000),
      label: 'Cockroach Control',
      alt: 'Close-up of a cockroach on a clean surface',
    },
    {
      src: pexels(11997005, 1000),
      label: 'Ant Colony Treatment',
      alt: 'Close-up of ants moving through soil and grass',
    },
    {
      src: pexels(95399, 1000),
      label: 'Rodent Control',
      alt: 'Rat visible near a small burrow opening',
    },
    {
      src: pexels(5422599, 1000),
      label: 'Spider Control',
      alt: 'Close-up of a spider on a web',
    },
  ],
}

export const getServiceImage = (service) =>
  stockImages.services[service.slug] ||
  stockImages.services[service.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')] ||
  stockImages.services['general-pest-control']
