'use client' // Error components must be Client Components
 
import Link from 'next/link'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className=' flex flex-col items-center justify-center pt-[60px] bg-red-300 h-full'>
      <h2 className='text-4xl'>{`Technical issues :(`}</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        <p className='pt-2 text-red-600 font-bold'>Try again</p>
      </button>
      <Link href="/games">
            <p className='mt-2'>While we are fixing the issue try some games, <span className='underline text-blue-600'> Go to games</span></p>
        </Link>
    </div>
  )
}