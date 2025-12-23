'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Calendar } from 'lucide-react'
import Image from 'next/image'
import kp from '../../public/kayaplanetlogo.png'
import { usePathname } from 'next/navigation'
import { useEnquiryPopup } from './EnquiryPopupContext'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const router = usePathname()
    const { openEnquiryPopup } = useEnquiryPopup()

    const navItems = [
        { name: 'HOME', href: '/' },
        { name: 'GALLERY', href: '/gallery' },
    ]

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                setIsMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isMenuOpen])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    return (
        <nav
            className={`h-[16] p-4 fixed w-full z-50 transition-colors duration-300 text-white ${isScrolled
                ? 'bg-[#151515]/80 backdrop-blur-xl'
                : router === '/gallery'
                    ? 'bg-black/70 backdrop-blur-xl'
                    : 'bg-transparent'
                }`}
        >

            <div className="container mx-auto">
                <div className="flex justify-between items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 min-w-0 flex-1">
                        <Image
                            src={kp}
                            alt="Kaya Planet Logo"
                            width="50"
                            height="50"
                            className="flex-shrink-0"
                        />
                        {/* Brand Name - visible on mobile */}
                        <div className="relative h-6 w-full max-w-[180px] md:hidden">
                            <Image
                                src="/kp-logo-white.png"
                                alt="Kaya Planet"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-6 items-center flex-shrink-0">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="hover:text-[#F27708] font-medium transition-colors duration-300"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={openEnquiryPopup}
                            className="bg-gradient-to-r from-[#F27708] to-[#F89134] text-white px-5 py-2 rounded-full flex items-center space-x-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>BOOK NOW</span>
                        </button>
                    </div>

                    {/* Mobile menu button and book button */}
                    <div className="md:hidden flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={openEnquiryPopup}
                            className="bg-gradient-to-r from-[#F27708] to-[#F89134] text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>BOOK</span>
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="text-[#F27708] hover:text-[#F89134] focus:outline-none ml-1"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden">
                    {/* Overlay */}
                    <div
                        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ease-in-out ${isMenuOpen
                            ? 'opacity-100'
                            : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Sidebar */}
                    <div
                        className={`fixed top-0 right-0 rounded-tl-xl h-full w-64 bg-[#FDFBF9] shadow-3xl transform transition-transform duration-300 ease-in-out backdrop-blur-md drop-shadow-2xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-[#111111] hover:text-[#F27708] focus:outline-none"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="flex flex-col space-y-6 mt-16 p-6 bg-[#FDFBF9] h-[100vh]">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-[#111111] border-b w-[100%] hover:text-[#F27708] font-medium transition-colors duration-300"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}