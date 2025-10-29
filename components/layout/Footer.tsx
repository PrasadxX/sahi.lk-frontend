import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">{siteConfig.name}</h3>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              {siteConfig.description}
            </p>
            <p className="text-xs text-slate-500">
              Your trusted source for premium electronics and gadgets in Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-violet-600 transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-violet-600 transition-colors font-medium">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="hover:text-violet-600 transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>{siteConfig.contact.hours}</div>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>{siteConfig.contact.location}</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 border border-violet-100">
          <div className="text-center mb-4">
            <h4 className="font-semibold text-slate-900 mb-2">Connect With Us</h4>
            <p className="text-sm text-gray-600">Follow us on social media for exclusive deals, updates & more!</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={siteConfig.links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white shadow-sm border border-violet-200 hover:border-violet-600 hover:shadow-md hover:scale-105 transition-all text-sm font-medium group"
              aria-label="Telegram"
            >
              <MessageCircle className="h-4 w-4 text-violet-600 group-hover:scale-110 transition-transform" />
              <span className="text-slate-700 group-hover:text-violet-600">Telegram</span>
            </a>
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white shadow-sm border border-green-200 hover:border-green-600 hover:shadow-md hover:scale-105 transition-all text-sm font-medium group"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-slate-700 group-hover:text-green-600">WhatsApp</span>
            </a>
            <a
              href={siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white shadow-sm border border-red-200 hover:border-red-600 hover:shadow-md hover:scale-105 transition-all text-sm font-medium group"
              aria-label="YouTube"
            >
              <Youtube className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="text-slate-700 group-hover:text-red-600">YouTube</span>
            </a>
            <a
              href={siteConfig.links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white shadow-sm border border-slate-200 hover:border-black hover:shadow-md hover:scale-105 transition-all text-sm font-medium group"
              aria-label="TikTok"
            >
              <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              <span className="text-slate-700 group-hover:text-black">TikTok</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200">
          {/* Payment Methods & Security */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">We Accept:</span>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold">
                  💳 Visa
                </div>
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold">
                  💳 MasterCard
                </div>
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold">
                  🏦 Bank Transfer
                </div>
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold">
                  💵 COD
                </div>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-300 hidden md:block" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded text-sm">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-semibold text-green-700">SSL Secure</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
            <p className="text-gray-600 text-center md:text-left">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <span>Developed by</span>
              <a 
                href="https://prasadx.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all"
              >
                prasadx.dev
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
