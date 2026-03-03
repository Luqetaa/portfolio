import { motion } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";
import ScanlineBox from "../ui/ScanlineBox";

export default function ContactSection() {
  const { theme } = useTheme();

  const contacts = [
    { label: "GitHub", value: "github.com/Luqetaa", icon: "[G]", link: "https://github.com/Luqetaa" },
    { label: "LinkedIn", value: "lucas-cavalcante-67a875318", icon: "[L]", link: "https://www.linkedin.com/in/lucas-cavalcante-67a875318/" },
  ];

  return (
    <section data-section="contact" className="relative py-32 px-6 pb-40">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 pb-6 border-b"
          style={{ borderColor: `${theme.primary}30` }}
        >
          <p className="text-xs font-mono tracking-widest mb-3" style={{ color: `${theme.primary}99` }}>04 / CONTACT</p>
          <h2
            className="text-6xl font-bold mb-4 leading-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: theme.primary,
              textShadow: `0 0 40px ${theme.primary}22`,
            }}
          >
            Get in Touch
          </h2>
          <p className="text-sm mt-4" style={{ color: theme.secondary }}>
            Lucas Cavalcante · São Paulo, BR · Disponível para oportunidades
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {contacts.map((contact, idx) => (
            <motion.a
              key={idx}
              href={contact.link}
              data-cursor
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <ScanlineBox className="p-6 h-full text-left transition-all duration-300">
                <div className="text-2xl font-bold font-mono mb-2" style={{ color: theme.accent }}>
                  {contact.icon}
                </div>
                <div className="text-sm font-mono font-bold tracking-widest" style={{ color: theme.primary }}>
                  {contact.label}
                </div>
                <div className="text-xs mt-2" style={{ color: theme.secondary }}>
                  {contact.value}
                </div>
              </ScanlineBox>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-12 border-t"
          style={{ borderColor: `${theme.primary}20` }}
        >
          <p className="text-xs font-mono tracking-widest" style={{ color: theme.secondary }}>
            © 2026 LUCAS CAVALCANTE | BUILT WITH REACT + TAILWIND + FRAMER MOTION
          </p>
          <p className="text-xs mt-4" style={{ color: `${theme.secondary}60` }}>
            github.com/Luqetaa · São Paulo, Brasil · Nascido em 2006
          </p>
        </motion.div>
      </div>
    </section>
  );
}
