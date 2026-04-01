/** Paths match `public/icons/check.svg` and `public/icons/currency-manat.svg` (currentColor for theming). */

export function PricingCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 12L10 17L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PricingManatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 24.8996V15.5662C8 13.7981 8.84285 12.1024 10.3431 10.8522C11.8434 9.60196 13.8783 8.89958 16 8.89958C18.1217 8.89958 20.1566 9.60196 21.6569 10.8522C23.1571 12.1024 24 13.7981 24 15.5662V24.8996M16 6.23291V24.8996"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
