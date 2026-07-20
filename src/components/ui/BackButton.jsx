import { useNavigate } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'

/*
 * Back button — returns to the previous page in history, falling back to Home
 * if the page was opened directly (no in-app history).
 */
export default function BackButton({ label = 'Back', className = '' }) {
  const navigate = useNavigate()
  const goBack = () => {
    navigate('/')
  }
  return (
    <button
      onClick={goBack}
      className={`inline-flex items-center gap-2 font-body text-sm text-fg-muted hover:text-acid transition-colors ${className}`}
    >
      <HiArrowLeft /> {label}
    </button>
  )
}
