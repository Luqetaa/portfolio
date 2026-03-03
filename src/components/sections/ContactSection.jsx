import { motion } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";
import ScanlineBox from "../ui/ScanlineBox";

export default function ContactSection() {
  const { theme } = useTheme();

  const contacts = [
    { label: "GitHub", value: "github.com/yourprofile", icon: "[G]", link: "#" },
    { label: "Email", value: "your.email@example.com", icon: "[@]", link: "#" },
    { label: "LinkedIn", value: "linkedin.com/in/yourprofile", icon: "[L]", link: "#" },
    { label: "Twitter", value: "@yourhandle", icon: "[T]", link: "#" },
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
          <p className="text-xs font-mono tracking-widest mb-2" style={{ color: theme.secondary }}>04 / CONTACT</p>
          <h2 className="text-4xl font-bold font-mono tracking-widest" style={{ color: theme.primary }}>
            GET IN TOUCH
          </h2>
          <p className="text-sm mt-4" style={{ color: theme.secondary }}>
            Let's create something immersive together
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
            © 2026 PORTFOLIO_V1 | BUILT WITH REACT + TAILWIND + FRAMER MOTION
          </p>
          <p className="text-xs mt-4" style={{ color: `${theme.secondary}60` }}>
            Design inspired by AAA game studios and modern tech aesthetics
          </p>
        </motion.div>
      </div>
    </section>
  );
}
