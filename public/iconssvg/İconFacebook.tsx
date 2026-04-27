import * as React from 'react'

export type IconFacebookProps = React.SVGProps<SVGSVGElement>

export function IconFacebook(props: IconFacebookProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="17"
      viewBox="0 0 11 17"
      fill="none"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path
        d="M0.75 6.58333V9.91667H3.25V15.75H6.58333V9.91667H9.08333L9.91667 6.58333H6.58333V4.91667C6.58333 4.69565 6.67113 4.48369 6.82741 4.32741C6.98369 4.17113 7.19565 4.08333 7.41667 4.08333H9.91667V0.75H7.41667C6.3116 0.75 5.25179 1.18899 4.47039 1.97039C3.68899 2.75179 3.25 3.8116 3.25 4.91667V6.58333H0.75Z"
        stroke="#0F477D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

