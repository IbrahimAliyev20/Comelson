import type { CompanyCard, CompanyResponse } from '@/types/types'

export function stripHtmlBasic(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** GET /companies — siyahı kartı üçün (API-də kateqoriya adı yoxdursa "—") */
export function companyResponseToCard(c: CompanyResponse): CompanyCard {
  const plain = stripHtmlBasic(c.description)
  return {
    id: String(c.id),
    name: c.name,
    category: c.category?.name ?? '—',
    description: plain.length > 0 ? plain : '—',
    logo: c.logo_url,
    profil: c.profil,
    status: c.status,
    voen: c.voen,
    country: c.country?.name ?? undefined,
    phone: c.phone,
    email: c.email,
    address: c.address,
    website: c.website,
    instagram: c.instagram,
    facebook: c.facebook,
    linkedin: c.linkedin,
  }
}
