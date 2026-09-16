import React from 'react'
import Hero from '../components/home/Hero'
import Marquee from '../components/home/Marquee'
import Stats, { CategoriesSection } from '../components/home/Categories'
import Steps from '../components/home/Steps'
import { Bestsellers, CustomCta, TestimonialsSection } from '../components/home/Rows'
import { FAQSection, FinalCta } from '../components/home/FAQFinal'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Steps />
      <CategoriesSection />
      <Bestsellers />
      <CustomCta />
      <TestimonialsSection />
      <FAQSection />
      <FinalCta />
    </>
  )
}