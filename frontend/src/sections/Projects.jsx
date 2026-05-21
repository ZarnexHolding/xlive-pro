import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { HiArrowRight } from "react-icons/hi";
import {
  Section,
  Container,
  SectionHeader,
} from "../components/layout/Section";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "../components/animations/Reveal";
import { projects } from "../data/projects";
import { getLenis } from "../hooks/useLenis";

function ProjectCard({ project, index }) {
  return (
    <motion.div
      className="group relative z-10 flex flex-col h-full md:min-h-[560px] min-h-[500px] overflow-hidden rounded-[26px] border border-white/[0.05] bg-[#0b0b0b] transition-all duration-500 hover:border-white/[0.08] hover:-translate-y-1"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Image / Placeholder */}
      <div className="relative h-[320px] overflow-hidden bg-[#111]">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bg-secondary">
            {/* Elegant placeholder */}
            <div className="text-center">
              <span className="font-display font-bold text-5xl text-border select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            {/* Subtle grid lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(237,232,223,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(237,232,223,0.06) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-bg/80 backdrop-blur-sm text-cream-muted text-[10px] tracking-widest uppercase px-3 py-1.5 border border-border">
            {project.category}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-bold text-[1.35rem] text-cream leading-tight">
            {project.title}
          </h3>
          <span className="section-label flex-shrink-0 mt-1">
            {project.year}
          </span>
        </div>

        <p className="text-cream-muted text-[15px] max-w-[32ch] leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-wide uppercase text-cream-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-cream-muted group-hover:text-accent transition-colors duration-200">
            <HiArrowRight size={16} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const scrollToContact = () => {
    const target = document.querySelector("#contact");
    if (!target) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target);
      return;
    }

    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section id="projects" className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            label="Projects"
            title="Work That Speaks"
            description="Selected productions that reflect XLIVE’s approach to immersive experiences, large-scale execution, and cinematic event design."
          />
        </Reveal>

        {/* Desktop grid */}
        <div className="relative hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {projects.map((project, i) => (
            <RevealItem key={project.id}>
              <ProjectCard project={project} index={i} />
            </RevealItem>
          ))}
        </div>

        {/* Mobile swiper */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1.02}
            centeredSlides={false}
            pagination={{ clickable: true }}
            className="!pb-10"
          >
            {projects.map((project, i) => (
              <SwiperSlide key={project.id}>
                <ProjectCard project={project} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA */}
        <Reveal delay={0.2}>
          <div className="mt-20 md:mt-24 text-center">
            <p className="text-cream-muted mb-5 text-sm">
              Crafted across global stages, immersive environments, and
              world-class productions.
            </p>
            <button
              onClick={scrollToContact}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md px-7 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-cream transition-all duration-500 hover:border-accent/40 hover:bg-accent hover:text-white hover:shadow-[0_0_40px_rgba(232,69,48,0.18)]"
            >
              <span className="relative z-10">Discuss Your Project</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                <HiArrowRight size={15} />
              </span>
            </button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
