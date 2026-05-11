import { useEffect } from 'react'

export const useNavScroll = (ref) => {
    useEffect(() => {
        const nav = ref.current
        if (!nav) return

        const onScroll = () => {
            nav.classList.toggle('sc', window.scrollY > 60)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [ref])
}