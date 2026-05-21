import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import { Section, Container } from "../components/layout/Section";
import { Reveal } from "../components/animations/Reveal";
import { sendContactForm } from "../services/contactApi";

const initialValues = {
  name: "",
  email: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Enter at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Tell us a little more about the project.";
  }

  return errors;
}

function FieldError({ id, children }) {
  if (!children) return null;

  return (
    <p id={id} className="mt-2 text-xs text-accent">
      {children}
    </p>
  );
}

export default function Contact() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
    setSubmitted(false);

    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      setSubmitMessage(null);

      const result = await sendContactForm({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });

      if (result.success) {
        setSubmitted(true);
        setValues(initialValues);

        setSubmitMessage({
          type: "success",
          text: "Message sent successfully. Our team will contact you shortly.",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: result.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error(error);

      setSubmitMessage({
        type: "error",
        text: "Failed to send message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" className="py-24 md:py-32 overflow-hidden" dark>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-accent" />
                <span className="text-[11px] tracking-[0.18em] uppercase text-white/35 font-medium">
                  Contact Us
                </span>
              </div>

              <h2 className="section-heading text-3xl md:text-5xl lg:text-6xl mb-6 max-w-xl">
                Let’s Build Something Remarkable.
              </h2>

              <p className="text-cream-muted leading-relaxed text-base md:text-lg max-w-md mb-10">
                Tell us about the experience you want to create. From
                large-scale productions to immersive brand moments, our team is
                ready to bring it to life.
              </p>

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
                  XLive@zar-nex.com
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
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7">
            <form
              noValidate
              onSubmit={handleSubmit}
              className="relative overflow-hidden border border-white/[0.1] bg-black/10 backdrop-blur-2xl p-6 md:p-10 lg:p-12 rounded-[28px] hadow-[0_10px_60px_rgba(0,0,0,0.45)]"
            >
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background: `
      linear-gradient(
        135deg,
        rgba(255,255,255,0.03) 0%,
        transparent 30%
      )
    `,
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <label className="block">
                  <span className="text-[11px] tracking-[0.18em] uppercase text-white/35 font-medium block mb-3">
                    Name
                  </span>
                  <input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    className="w-full h-[58px] bg-black/30 border border-white/[0.04] rounded-2xl px-5 text-[14px] text-cream placeholder:text-white/22 outline-none transition-all duration-500 focus:border-accent/50 focus:bg-white/[0.03] focus:shadow-[0_0_0_4px_rgba(232,69,48,0.12)] hover:border-white/[0.1]"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  <FieldError id="contact-name-error">{errors.name}</FieldError>
                </label>

                <label className="block">
                  <span className="text-[11px] tracking-[0.18em] uppercase text-white/35 font-medium block mb-3">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    className="w-full h-[58px] bg-black/30 border border-white/[0.04] rounded-2xl px-5 text-[14px] text-cream placeholder:text-white/22 outline-none transition-all duration-500 focus:border-accent/50 focus:bg-white/[0.03] focus:shadow-[0_0_0_4px_rgba(232,69,48,0.12)] hover:border-white/[0.1]"
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                  <FieldError id="contact-email-error">
                    {errors.email}
                  </FieldError>
                </label>
              </div>

              <label className="block mb-6">
                <span className="text-[11px] tracking-[0.18em] uppercase text-white/35 font-medium block mb-3">
                  Message
                </span>
                <textarea
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  className="w-full min-h-[180px] resize-none bg-black/30 border border-white/[0.04] rounded-2xl px-5 py-5 text-[14px] text-cream placeholder:text-white/22 outline-none transition-all duration-500 focus:border-accent/50 focus:bg-white/[0.03] focus:shadow-[0_0_0_4px_rgba(232,69,48,0.12)] hover:border-white/[0.1]"
                  placeholder="Tell us about the event, timeline, location, and what you want to create."
                />
                <FieldError id="contact-message-error">
                  {errors.message}
                </FieldError>
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <motion.button
                  type="submit"
                  className="group relative overflow-hidden h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-accent text-white text-[11px] uppercase tracking-[0.12em] font-medium transition-all duration-500 hover:scale-[1.02] hover:bg-[#ff5a43] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <motion.span
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                  <span className="relative z-10">
                    {loading ? "Sending..." : "Send Message"}
                  </span>
                </motion.button>

                {submitMessage && (
                  <motion.p
                    className={`
      flex items-center gap-2 text-sm
      ${submitMessage.type === "success" ? "text-cream-muted" : "text-red-400"}
    `}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {submitMessage.type === "success" ? (
                      <HiOutlineCheckCircle className="text-accent" size={18} />
                    ) : (
                      <HiOutlineXCircle className="text-red-400" size={18} />
                    )}

                    {submitMessage.text}
                  </motion.p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
