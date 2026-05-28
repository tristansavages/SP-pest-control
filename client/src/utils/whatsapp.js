export const WHATSAPP_NUMBER = '27608117897'
export const DEFAULT_MESSAGE = 'Hi SP Pest Control, I would like to enquire about pest control services. Please contact me.'

export const buildWhatsAppUrl = (message = DEFAULT_MESSAGE) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const buildServiceEnquiryUrl = (serviceName) => {
  const message = `Hi SP Pest Control, I would like to enquire about ${serviceName}. Please contact me.`
  return buildWhatsAppUrl(message)
}

export const buildPlanEnquiryUrl = (planName) => {
  const message = `Hi SP Pest Control, I would like to enquire about ${planName}. Please contact me.`
  return buildWhatsAppUrl(message)
}

export const buildIndustryEnquiryUrl = (industryName) => {
  const message = `Hi SP Pest Control, I would like to enquire about pest control for ${industryName}. Please contact me.`
  return buildWhatsAppUrl(message)
}

export const buildBookingUrl = (data) => {
  const message = `Hi SP Pest Control, I would like to book a pest control service.

Name: ${data.full_name || ''}
Phone: ${data.phone || ''}
Email: ${data.email || 'Not provided'}
Address / Area: ${data.address || ''}
Customer Type: ${data.customer_type || ''}
Service Type: ${data.service_category || 'Once-Off Service'}
Pest Problem: ${data.pest_problem || ''}
Preferred Date: ${data.preferred_date || 'Flexible'}
Preferred Time: ${data.preferred_time || 'Flexible'}
Urgency: ${data.urgency || 'Normal'}
Message: ${data.message || 'None'}

Please contact me to confirm the booking.`
  return buildWhatsAppUrl(message)
}

export const openWhatsApp = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export const DEFAULT_WA_URL = buildWhatsAppUrl(DEFAULT_MESSAGE)
