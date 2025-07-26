// Footer.jsx - Modern cinema footer
import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  Film,
  Star,
  Calendar,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    company: {
      title: "CineZone",
      description:
        "Your ultimate destination for the best movie experience. Enjoy the latest blockbusters with premium sound and picture quality.",
      stats: [
        { icon: Film, label: "Movies", value: "500+" },
        { icon: Star, label: "Rating", value: "4.8" },
        { icon: MapPin, label: "Locations", value: "25+" },
      ],
    },
    quickLinks: {
      title: "Quick Links",
      links: [
        { name: "Now Showing", href: "#now-showing" },
        { name: "Coming Soon", href: "#coming-soon" },
        { name: "Promotions", href: "#promotions" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    services: {
      title: "Services",
      links: [
        { name: "Online Booking", href: "/booking" },
        { name: "Group Booking", href: "/group-booking" },
        { name: "Gift Cards", href: "/gift-cards" },
        { name: "Membership", href: "/membership" },
        { name: "Food & Beverage", href: "/food" },
        { name: "Private Screening", href: "/private" },
      ],
    },
    contact: {
      title: "Contact Info",
      info: [
        {
          icon: MapPin,
          label: "Address",
          value: "123 Cinema Street, Entertainment District, City 12345",
        },
        {
          icon: Phone,
          label: "Phone",
          value: "+1 (555) 123-4567",
        },
        {
          icon: Mail,
          label: "Email",
          value: "info@cinezone.com",
        },
        {
          icon: Clock,
          label: "Hours",
          value: "Daily: 10:00 AM - 12:00 AM",
        },
      ],
    },
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-400",
    },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-400",
    },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-400" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6a57f5]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Section */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#6a57f5] to-blue-500 bg-clip-text text-transparent mb-4">
                  {footerSections.company.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {footerSections.company.description}
                </p>
              </div>

              {/* Company Stats */}
              <div className="grid grid-cols-3 gap-4">
                {footerSections.company.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <stat.icon
                      size={20}
                      className="mx-auto mb-2 text-[#6a57f5]"
                    />
                    <div className="text-sm font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-gray-400 transition-all duration-300 hover:scale-110 hover:border-slate-600/50 ${social.color}`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">
                {footerSections.quickLinks.title}
              </h4>
              <ul className="space-y-3">
                {footerSections.quickLinks.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#6a57f5] transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#6a57f5] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">
                {footerSections.services.title}
              </h4>
              <ul className="space-y-3">
                {footerSections.services.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#6a57f5] transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#6a57f5] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">
                {footerSections.contact.title}
              </h4>
              <div className="space-y-4">
                {footerSections.contact.info.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="p-2 bg-[#6a57f5]/10 rounded-lg border border-[#6a57f5]/20 group-hover:bg-[#6a57f5]/20 transition-colors duration-300">
                      <item.icon size={16} className="text-[#6a57f5]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {item.label}
                      </div>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Newsletter Signup - Enhanced */}
              <div className="relative p-6 bg-gradient-to-br from-[#6a57f5]/15 via-purple-600/10 to-blue-500/15 backdrop-blur-sm rounded-2xl border border-[#6a57f5]/30 hover:border-[#6a57f5]/50 transition-all duration-300 group overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6a57f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#6a57f5]/10 rounded-full blur-2xl group-hover:bg-[#6a57f5]/20 transition-colors duration-500"></div>

                <div className="relative z-10">
                  {/* Header with Icon */}
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-[#6a57f5]/20 rounded-lg mr-3 group-hover:bg-[#6a57f5]/30 transition-colors duration-300">
                      <Mail size={20} className="text-[#6a57f5]" />
                    </div>
                    <h5 className="text-white font-bold text-lg">Newsletter</h5>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Get updates on new movies and
                    <span className="text-[#6a57f5] font-medium">
                      {" "}
                      exclusive promotions
                    </span>
                  </p>

                  {/* Enhanced Input Group */}
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-slate-600/50 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a57f5]/50 focus:border-[#6a57f5]/50 transition-all duration-300 group hover:border-slate-500/50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6a57f5]/5 to-transparent opacity-0 focus-within:opacity-100 rounded-xl pointer-events-none transition-opacity duration-300"></div>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-[#6a57f5] to-[#5a47e5] text-white rounded-xl text-sm font-semibold hover:from-[#5a47e5] hover:to-[#4a37d5] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#6a57f5]/25 active:scale-95 group/btn">
                        <span className="flex items-center justify-center">
                          Subscribe
                          <svg
                            className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>

                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6a57f5]/10 via-transparent to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center text-gray-400 text-sm">
                <span>© {currentYear} CineZone. Made with</span>
                <Heart size={16} className="mx-2 text-red-400 fill-red-400" />
                <span>for movie lovers</span>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center space-x-6 text-sm">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-[#6a57f5] transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 p-3 bg-[#6a57f5] text-white rounded-full shadow-lg hover:bg-[#5a47e5] transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Scroll to top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-y-1 transition-transform duration-300"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
