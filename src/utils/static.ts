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
  { key: "tenders" as const, href: "/tenders", hasDropdown: false },
  { key: "members" as const, href: "/members", hasDropdown: false },
  { key: "media" as const, href: "/events", hasDropdown: true },
  { key: "contact" as const, href: "/contact", hasDropdown: false },
]