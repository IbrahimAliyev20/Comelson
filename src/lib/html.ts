import sanitizeHtml from 'sanitize-html'

/**
 * Mətn redaktorundan (CKEditor) gələn məzmun bəzən HTML entity kimi kodlaşdırılmış
 * gəlir (məs. `&lt;strong&gt;` real `<strong>` əvəzinə) və ya `&nbsp;`, `&amp;`
 * kimi entity-lər saxlayır. Bu helper-lər həmin məzmunu hər yerdə düzgün
 * göstərmək üçündür:
 *  - `toRenderableHtml` → `dangerouslySetInnerHTML` üçün (bold, başlıq və s. tətbiq olunur,
 *     məzmun DOMPurify ilə təmizlənir — XSS qarşısını alır)
 *  - `stripHtmlToText`  → kart/önizləmə üçün təmiz mətn (teq/entity sızmır)
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
  copy: '©',
  reg: '®',
  trade: '™',
  deg: '°',
  euro: '€',
  pound: '£',
}

function safeFromCodePoint(code: number): string {
  try {
    if (!Number.isFinite(code) || code <= 0) return ''
    return String.fromCodePoint(code)
  } catch {
    return ''
  }
}

function decodeOnce(value: string): string {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => safeFromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeFromCodePoint(parseInt(dec, 10)))
    .replace(
      /&([a-zA-Z]+);/g,
      (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match
    )
}

/**
 * HTML entity-ləri açır. İkiqat kodlaşdırılmış məzmunu da (`&amp;lt;`) həll etmək
 * üçün dəyişiklik dayanana qədər (maksimum bir neçə dəfə) təkrarlayır.
 */
export function decodeHtmlEntities(value: string | null | undefined): string {
  if (!value) return ''
  let prev = value
  let next = decodeOnce(value)
  let guard = 0
  while (next !== prev && guard < 5) {
    prev = next
    next = decodeOnce(next)
    guard += 1
  }
  return next
}

const REAL_TAG_RE = /<\/?[a-z][^>]*>/i

/**
 * `dangerouslySetInnerHTML` üçün məzmunu hazırlayır.
 * - Artıq real HTML teqləri varsa olduğu kimi qaytarır (redaktorun düzgün çıxışı).
 * - Yalnız entity kimi kodlaşdırılıbsa (`&lt;p&gt;`), açıb real teqlərə çevirir.
 */
export function toRenderableHtml(value: string | null | undefined): string {
  if (!value) return ''
  // Artıq real teqlər varsa olduğu kimi, yoxsa entity-ləri açıb real HTML alırıq.
  const html = REAL_TAG_RE.test(value) ? value : decodeHtmlEntities(value)
  // Hər halda `sanitize-html` ilə təmizləyirik — istifadəçi məzmunundan (məs. tender
  // təsviri) gələ biləcək `<script>`, `onerror=` və s. zərərli kodları silir.
  // `sanitize-html` təmiz JS-dir (jsdom yoxdur), ona görə Vercel serverless runtime-da
  // da problemsiz işləyir.
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'span', 'div',
      'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'small',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      '*': ['style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  })
}

/**
 * Önizləmə/kart üçün təmiz mətn: əvvəl entity-ləri açır, sonra teqləri silir,
 * boşluqları yığır. Beləcə `<strong>` və ya `&lt;p&gt;` istifadəçiyə görünmür.
 */
export function stripHtmlToText(value: string | null | undefined): string {
  if (!value) return ''
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
