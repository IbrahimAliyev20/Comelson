import React from 'react'

function Container({ children,className }: { children: React.ReactNode,className?: string }) {
  return (
    <div className={`mx-auto w-full min-w-0 max-w-[1440px] px-3 sm:px-4 md:px-[40px] ${className}`}>
        {children}
    </div>
  )
}

export default Container