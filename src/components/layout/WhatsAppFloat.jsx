import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useSettingsStore } from '../../context/AppContext'

export default function WhatsAppFloat() {
  const { settings } = useSettingsStore()
  return (
    <a
      href={`https://wa.me/${settings?.whatsapp || '919000000000'}?text=Hi Sports Hub, I need help with an order.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="animate-float fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lift transition hover:scale-105 hover:bg-emerald-600"
    >
      <FaWhatsapp className="text-2xl" />
    </a>
  )
}