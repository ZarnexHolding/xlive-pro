import { Link } from 'react-router-dom'
import { HiArrowUpRight } from 'react-icons/hi2'

/*
 * Featured project card → links to its /work/:slug case study.
 * `size` controls aspect ratio in the editorial grid.
 */
export default function ProjectCard({ project, size = 'md' }) {
  const aspect = size === 'lg' ? 'aspect-[16/10]' : size === 'wide' ? 'aspect-[16/9]' : 'aspect-[4/3]'
  return (
    <Link to={`/work/${project.slug}`} data-cursor="hover" className="group block relative overflow-hidden rounded-md bg-ink-800 cursor-pointer">
      <div className={`relative ${aspect} overflow-hidden`}>
        <img
          src={project.image}
          alt={`${project.title} — ${project.summary}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
        <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-md" />

        {/* top meta */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between">
          <span className="font-body text-[11px] uppercase tracking-[0.18em] text-fg/80 bg-ink-950/40 backdrop-blur-sm px-2.5 py-1 rounded-xs">
            {project.category}
          </span>
          <span className="font-body text-xs text-fg/70 tabular-nums">{project.year}</span>
        </div>

        {/* hover arrow */}
        <div className="absolute top-4 right-4 opacity-0 translate-y-1 transition-all duration-500 ease-expo group-hover:opacity-100 group-hover:translate-y-0">
          <span className="hidden group-hover:flex items-center justify-center h-9 w-9 rounded-full bg-acid text-ink-950">
            <HiArrowUpRight size={16} />
          </span>
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3 className="font-display font-bold text-2xl md:text-[1.75rem] leading-tight transition-transform duration-500 ease-expo group-hover:-translate-y-0.5">
            {project.title}
          </h3>
          <p className="mt-1.5 font-body text-sm text-fg-muted">
            {project.client} · {project.location}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((t) => (
              <span key={t} className="font-body text-[11px] text-fg-muted border border-line rounded-xs px-2.5 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
