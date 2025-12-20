'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import whatsappIcon from '../../public/whatsapp-icon.jpg'

export default function WhatsAppChatBox() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    const expansionTimer = setTimeout(() => {
      setIsExpanded(true)
    }, 7000)

    return () => {
      clearTimeout(visibilityTimer)
      clearTimeout(expansionTimer)
    }
  }, [])

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
  }

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase()

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div
        className={`relative transition-all duration-300 ease-in-out hidden md:block ${isExpanded
          ? 'w-72 h-96 pointer-events-auto'
          : 'w-16 h-16 pointer-events-none'
          }`}
      >
        <div
          className={`whatsapp-bg rounded-lg shadow-lg p-4 absolute bottom-0 right-0 transition-all duration-300 ease-in-out ${isExpanded
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
      {/* Desktop: expandable button */}
      <button
        onClick={handleExpand}
        className={`absolute bottom-0 right-0 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-110 hidden md:flex ${isExpanded ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 pointer-events-auto'
          }`}
      >
        <Image
          src={whatsappIcon}
          alt="WhatsApp"
          width={24}
          height={24}
        />
      </button>
      {/* Mobile: direct link to WhatsApp */}
      <a
        href="https://wa.me/919999424375"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      >
        <Image
          src={whatsappIcon}
          alt="WhatsApp"
          width={24}
          height={24}
        />
      </a>
      <style jsx>{`
        .whatsapp-bg {
          background-color: #e5ddd5;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4ccc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .message-bubble {
          position: relative;
          border-radius: 0.75rem;
          margin-left: 10px;
        }
        .message-bubble::after {
          content: '';
          position: absolute;
          left: -10px;
          top: 20%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-color: white;
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
      `}</style>
    </div>
  )
}