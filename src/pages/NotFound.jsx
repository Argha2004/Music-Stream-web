import { Link } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'
import { buttonVariants } from '@heroui/react'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
        <SearchX className="h-6 w-6 text-accent" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-sm text-muted">
        That page doesn't exist. It may have been moved or the link is out of date.
      </p>
      <Link to="/" className={`${buttonVariants({ variant: 'primary' })} mt-8`}>
        <Home className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
    </div>
  )
}
