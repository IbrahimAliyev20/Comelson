import * as React from 'react'

export type IconXProps = React.SVGProps<SVGSVGElement>

export function IconX(props: IconXProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      focusable="false"
      {...props}
    >
      <g clipPath="url(#clip0_824_4923)">
        <path
          d="M3.33398 3.33337L13.1115 16.6667H16.6673L6.88982 3.33337H3.33398Z"
          stroke="#0F477D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.33398 16.6667L8.97398 11.0267M11.024 8.97671L16.6673 3.33337"
          stroke="#0F477D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_824_4923">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

