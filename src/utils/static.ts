export const navigationItems = [
    { label: "jobs", href: "/jobs" },
    { label: "companies", href: "/companies" },
    { label: "categories", href: "/categories" },
    { label: "cvs", href: "/cvs" },
    { label: "about", href: "/about" },
  ]

export const heroNavigationItems = [
  { key: "home" as const, href: "/", hasDropdown: false },
  { key: "about" as const, href: "/about", hasDropdown: true },
  { key: "services" as const, href: "/services", hasDropdown: false },
  { key: "tender" as const, href: "/tender", hasDropdown: false },
  { key: "members" as const, href: "/members", hasDropdown: false },
  { key: "news" as const, href: "/news", hasDropdown: true },
  { key: "contact" as const, href: "/contact", hasDropdown: false },
]