import { resolveAuthMediaUrl } from '@/lib/auth/resolve-media-url'
import type { MemberResponse } from '@/types/types'

/** Default placeholder shown when a member has no usable logo. */
export const DEFAULT_MEMBER_LOGO = '/images/Logo.svg'

type MemberLogoFields = Pick<
  MemberResponse,
  'logo_url' | 'profil' | 'image' | 'thumb_image'
>

/**
 * Tək, ardıcıl loqo mənbəyi — komponentlər arasında fərqli sahə adlarından
 * (`logo_url` / `profil` / `image` / `thumb_image`) istifadə problemini həll edir.
 * Nisbi yolları tam URL-ə çevirir; heç biri yoxdursa default loqo qaytarır.
 */
export function getMemberLogoSrc(member: MemberLogoFields | null | undefined): string {
  const candidate =
    member?.logo_url?.trim() ||
    member?.profil?.trim() ||
    member?.image?.trim() ||
    member?.thumb_image?.trim() ||
    ''

  return resolveAuthMediaUrl(candidate) ?? DEFAULT_MEMBER_LOGO
}
