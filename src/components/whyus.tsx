"use client";

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'

interface Feature {
  imageUrl: string;
  title: string;
  desc: string;
}

export default function Component() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch features from the API
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch("https://kpcrud-vj8f.vercel.app/api/links8") // replace with your actual endpoint if different
        if (!res.ok) {
          throw new Error('Failed to fetch features')
        }

        const data = await res.json()
        setFeatures(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  return (
    <div
      className="flex min-h-[50vw] flex-col items-center justify-center py-9 md:py-[5%] px-4 sm:px-6 lg:px-8"
      ref={ref}
      style={{
        transform: isInView ? 'none' : 'translateY(200px)',
        opacity: isInView ? 1 : 0,
        transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto text-center"
      >
        <h1 className="md:text-4xl text-3xl font-semibold md:font-extrabold text-center text-stone-800 mb-[5%] sm:mb-16 lg:mb-20">
          Why Choose Our Salon?
        </h1>

        {loading && <p className="text-center">Loading features...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid md:px-0 md:py-0 py-2 px-3 grid-cols-1 mt-[9%] sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {features.map((feature: Feature, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-full h-64 mb-6 overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h2 className="md:text-2xl text-xl font-semibold text-stone-700 mb-3">{feature.title}</h2>
                <p className="text-stone-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
