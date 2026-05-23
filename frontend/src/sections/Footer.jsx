import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from "react-icons/ri";
import xliveLogo from "../assets/Xlive-logo-trans.png";
import { Section, Container } from "../components/layout/Section";
import { Reveal } from "../components/animations/Reveal";

const footerLinks = [
  {
    heading: "Company",
    links: ["About", "Services", "Projects", "Sectors", "Clients"],
  },
  {
    heading: "Services",
    links: [
      "Audio Visual Production",
      "Stage & Set Design",
      "Event Management",
      "Creative Direction",
      "Live Entertainment",
      "Broadcast & Streaming",
    ],
  },
  {
    heading: "Sectors",
    links: ["Government", "Corporate", "Entertainment", "Sports", "Luxury"],
  },
];

const socials = [
  { Icon: RiInstagramLine, label: "Instagram", href: "#" },
  { Icon: RiLinkedinLine, label: "LinkedIn", href: "#" },
  { Icon: RiTwitterXLine, label: "X", href: "#" },
  { Icon: RiYoutubeLine, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <Section id="footer" className="pt-24 md:pt-32 pb-10">
      <Container>
        {/* Main footer grid */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <img
                src={xliveLogo}
                alt="XLIVE"
                className="h-8 md:h-16 w-auto object-contain mt-[-65px] mb-4"
                style={{ filter: "brightness(1.05)" }}
              />
              <p className="text-cream-muted text-sm leading-relaxed mb-6 max-w-xs">
                Event Production & Technologies. Crafting extraordinary live
                experiences across the Middle East since 2008.
              </p>

              {/* Contact */}
              <div className="space-y-4 text-sm">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=XLive@zar-nex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream-muted hover:text-cream hover:translate-x-[2px] transition-all duration-300"
                >
                  <HiOutlineMail
                    size={16}
                    className="text-accent flex-shrink-0"
                  />
                  7arnex@gmail.com
                </a>
                <a
                  href="tel:+97100000000"
                  className="flex items-center gap-3 text-cream-muted hover:text-cream hover:translate-x-[2px] transition-all duration-300"
                >
                  <HiOutlinePhone
                    size={18}
                    className="text-accent flex-shrink-0"
                  />
                  +971 00 000 0000
                </a>
                <div className="flex items-start gap-3 text-cream-muted">
                  <HiOutlineLocationMarker
                    size={18}
                    className="text-accent flex-shrink-0 mt-0.5"
                  />
                  <span>Dubai, United Arab Emirates</span>
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-3 mt-6">
                {socials.map(({ Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 border border-border flex items-center justify-center text-cream-muted hover:text-cream hover:border-cream/30 transition-all duration-200"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerLinks.map((group) => (
                <div key={group.heading}>
                  <p className="section-label mb-5">{group.heading}</p>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link}>
                        <button className="text-sm text-cream-muted hover:text-cream transition-colors duration-200 text-left">
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <Reveal>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream-muted text-xs">
              © {new Date().getFullYear()} XLIVE Event Production &
              Technologies. All rights reserved.
            </p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <button
                  key={item}
                  className="text-cream-muted text-xs hover:text-cream transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
