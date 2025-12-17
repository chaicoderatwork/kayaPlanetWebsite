'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import whatsappIcon from '../../public/whatsapp-icon.jpg'

export default function WhatsAppChatBox() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [bgImage, setBgImage] = useState('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    const expansionTimer = setTimeout(() => {
      setIsExpanded(true)
      setBgImage('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')
    }, 7000)

    return () => {
      clearTimeout(visibilityTimer)
      clearTimeout(expansionTimer)
    }
  }, [])

  const handleExpand = () => {
    setIsExpanded(true)
    setBgImage('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')
  }

  const handleCollapse = () => {
    setIsExpanded(false)
  }

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase()

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-transform duration-500 ease-in-out hidden md:block ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div
        className={`relative transition-all duration-300 ease-in-out ${isExpanded
            ? 'w-72 h-96 pointer-events-auto'
            : 'w-16 h-16 pointer-events-none'
          }`}
      >
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className={`rounded-lg shadow-lg p-4 absolute bottom-0 right-0 transition-all duration-300 ease-in-out ${isExpanded
              ? 'opacity-100 scale-100 w-full h-full'
              : 'opacity-0 scale-95 w-16 h-16'
            }`}
        >
          <div className="message-bubble bg-white p-3 shadow-sm relative mt-6 mb-4">
            <p className="text-gray-800 font-medium mb-1 relative z-10">Get in Touch Now!</p>
            <span className="text-xs text-gray-500 absolute bottom-1 right-2 z-10">{currentTime}</span>
          </div>
          <div className="mt-4 flex flex-col justify-between h-[calc(100%-6rem)]">
            <p className="text-gray-700 mb-4">Have any questions? We&apos;re here to help!</p>
            <a
              href="https://wa.me/919999424375"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 px-4 bg-[#25D366] text-white rounded-full text-center font-medium hover:bg-[#128C7E] transition duration-300"
            >
              Start Chat
            </a>
          </div>
          <button
            onClick={handleCollapse}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <button
        onClick={handleExpand}
        className={`absolute bottom-0 right-0 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-110 ${isExpanded ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 pointer-events-auto'
          }`}
      >
        <Image
          src={whatsappIcon}
          alt="WhatsApp"
          width={24}
          height={24}
        />
      </button>
      <style jsx>{`
        .message-bubble {
          position: relative;
          border-radius: 0.75rem;
          margin-left: 10px; /* Add some space for the protrusion */
        }
        .message-bubble::after {
          content: '';
          position: absolute;
          left: -10px; /* Position it outside the bubble */
          top: 20%; /* Center vertically */
          transform: translateY(-50%); /* Adjust for perfect centering */
          width: 20px;
          height: 20px;
          background-color: white;
          clip-path: polygon(100% 0, 0 0, 100% 100%); /* Create left-pointing triangle */
        }
      `}</style>
    </div>
  )
}