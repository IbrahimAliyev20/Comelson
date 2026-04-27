import * as React from 'react'

export type IconTelegramProps = React.SVGProps<SVGSVGElement>

export function IconTelegram(props: IconTelegramProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path
        d="M15 10L11 14L17 20L21 4L3 11L7 13L9 19L12 15"
        stroke="#14171A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

