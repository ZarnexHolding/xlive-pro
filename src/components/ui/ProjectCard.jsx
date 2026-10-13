import { Link } from 'react-router-dom'
import { HiArrowUpRight } from 'react-icons/hi2'
import Img from './Img'

/*
 * Project card → links to its /work/:slug case study.
 * `size` controls aspect ratio in the editorial grid. On desktop the narrow
 * `md` card has no intrinsic height and stretches to match the taller `lg`
 * card beside it, so every row's bottom edge lines up.
 * Meta lives in the caption band, never as pills over the photo.
 */
export default function ProjectCard({ project, size = 'md', sizes = '(min-width:1024px) 50vw, 100vw' }) {
  const aspect =
    size === 'lg' ? 'aspect-[16/10]' : size === 'wide' ? 'aspect-[16/10] lg:aspect-[21/9]' : 'aspect-[4/3]'
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block h-full relative overflow-hidden rounded-lg bg-ink-800 cursor-pointer"
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        <Img
          src={project.image}
          alt={`${project.title}: ${project.summary}`}
          sizes={sizes}
          className="w-full h-full object-cover transition-transform duration-[1100ms] ease-expo group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
        <div className="absolute inset-0 ring-1 ring-inset ring-line rounded-lg" />

        {/* hover arrow */}
        <div className="absolute top-4 right-4 opacity-0 translate-y-1 transition-all duration-500 ease-expo group-hover:opacity-100 group-hover:translate-y-0">
          <span className="flex items-center justify-center h-9 w-9 rounded-full bg-acid text-ink-950">
            <HiArrowUpRight size={16} />
          </span>
        </div>

        {/* caption band */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <p className="index">
            {project.category} · {project.year}
          </p>
          <h3 className="mt-2 font-display font-bold font-semi-wide text-2xl md:text-[1.75rem] leading-tight transition-transform duration-500 ease-expo group-hover:-translate-y-0.5">
            {project.title}
          </h3>
          <p className="mt-1.5 font-body text-sm text-fg-muted">
            {project.client} · {project.location}
          </p>
        </div>
      </div>
    </Link>
  )
}
