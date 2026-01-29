import React from 'react'

const Choose = ({title,reason,className = "" }) => {
  return (
    <div className={`par border border-r-0 px-10 lg:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[var(--primary)] hover:text-[var(--white)] transition-all duration-500 text-[var(--grey)] cursor-pointer ${className}`}>
            <strong className='text-black'>{title}</strong>
            <p>{reason}</p>
    </div>
  )
}

export default Choose
