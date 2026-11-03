const env = import.meta.env;

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value?.trim()) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clampInteger = (value: string | undefined, fallback: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.round(parseNumber(value, fallback))));

const latitude = Math.min(90, Math.max(-90, parseNumber(env.PUBLIC_MAP_LATITUDE, 55.0281445)));
const longitude = Math.min(180, Math.max(-180, parseNumber(env.PUBLIC_MAP_LONGITUDE, 61.2921175)));
const zoom = clampInteger(env.PUBLIC_MAP_ZOOM, 14, 1, 21);
const previewWidth = clampInteger(env.PUBLIC_MAP_PREVIEW_WIDTH, 600, 100, 650);
const previewHeight = clampInteger(env.PUBLIC_MAP_PREVIEW_HEIGHT, 300, 100, 450);
const mapLayer = ['map', 'sat', 'skl'].includes(env.PUBLIC_MAP_LAYER ?? '') ? env.PUBLIC_MAP_LAYER : 'map';
const coordinates = `${longitude},${latitude}`;
const mapEmbedParams = new URLSearchParams({
  ll: coordinates,
  z: String(zoom),
  l: mapLayer,
  pt: `${coordinates},pm2rdm`,
});
const staticMapParams = new URLSearchParams({
  lang: 'ru_RU',
  ll: coordinates,
  z: String(zoom),
  size: `${previewWidth},${previewHeight}`,
  l: mapLayer,
});

export const siteConfig = {
  siteDomain: (env.PUBLIC_SITE_DOMAIN?.trim() || 'pb.bistray.club').replace(/^https?:\/\//, '').replace(/\/$/, ''),
  contactFunctionUrl: env.PUBLIC_CONTACT_FUNCTION_URL ?? '',
  phoneNumber: env.PUBLIC_PHONE_NUMBER?.trim() || '+7 (999) 444-01-74',
  clubAddress: env.PUBLIC_CLUB_ADDRESS?.trim() || 'КСК «Быстрай»',
  openingHours: env.PUBLIC_OPENING_HOURS?.trim() || 'Вт—Вс: 11:00 — 19:00',
  pricePerPlayer: env.PUBLIC_PRICE_PER_PLAYER?.trim() || '1500',
  minPlayers: env.PUBLIC_MIN_PLAYERS?.trim() || '6',
  includedBalls: env.PUBLIC_INCLUDED_BALLS?.trim() || '200',
  map: {
    address: env.PUBLIC_MAP_ADDRESS?.trim() || 'г. Челябинск, Уфимский тракт, 122/3',
    latitude,
    longitude,
    zoom,
    previewWidth,
    previewHeight,
    markerColor: /^#[\da-f]{6}$/i.test(env.PUBLIC_MAP_MARKER_COLOR ?? '')
      ? env.PUBLIC_MAP_MARKER_COLOR
      : '#b7ff00',
    previewUrl: `https://static-maps.yandex.ru/1.x/?${staticMapParams}`,
    embedUrl: `https://yandex.ru/map-widget/v1/?${mapEmbedParams}`,
    directionsUrl: `https://yandex.ru/maps/?${mapEmbedParams}`,
  },
};

export function getOpeningHoursSchema(hours: string): string[] {
  const match = hours.match(/(Пн|Вт|Ср|Чт|Пт|Сб|Вс)\s*[—–-]\s*(Пн|Вт|Ср|Чт|Пт|Сб|Вс)\s*:\s*(\d{1,2}:\d{2})\s*[—–-]\s*(\d{1,2}:\d{2})/i);
  if (!match) return [];

  const days: Record<string, string> = { Пн: 'Mo', Вт: 'Tu', Ср: 'We', Чт: 'Th', Пт: 'Fr', Сб: 'Sa', Вс: 'Su' };
  const startDay = days[match[1]];
  const endDay = days[match[2]];
  return startDay && endDay ? [`${startDay}-${endDay} ${match[3]}-${match[4]}`] : [];
}

export function renderContent(template: string): string {
  const phoneHref = siteConfig.phoneNumber.replace(/[^+\d]/g, '');
  const minimum = Number(siteConfig.minPlayers);
  const price = Number(siteConfig.pricePerPlayer);
  const replacements: Record<string, string> = {
    '{{PHONE}}': siteConfig.phoneNumber,
    '{{CURRENT_YEAR}}': String(new Date().getFullYear()),
    '{{PHONE_HREF}}': phoneHref,
    '{{CLUB_ADDRESS}}': siteConfig.clubAddress,
    '{{OPENING_HOURS}}': siteConfig.openingHours,
    '{{PRICE_PER_PLAYER}}': price ? price.toLocaleString('ru-RU') : '',
    '{{MIN_PLAYERS}}': minimum ? String(minimum) : '',
    '{{TOTAL_PRICE}}': price && minimum ? (price * minimum).toLocaleString('ru-RU') : '',
    '{{INCLUDED_BALLS}}': siteConfig.includedBalls,
    '{{PRICE_PER_PLAYER_VALUE}}': price ? String(price) : '',
    '{{MIN_PLAYERS_VALUE}}': minimum ? String(minimum) : '',
    '{{PHONE_HREF_VALUE}}': phoneHref,
    '{{MAP_ADDRESS}}': siteConfig.map.address,
    '{{MAP_PREVIEW_URL}}': siteConfig.map.previewUrl,
    '{{MAP_PREVIEW_ALT}}': `Статичная карта: ${siteConfig.map.address}`,
    '{{MAP_MARKER_COLOR}}': siteConfig.map.markerColor,
  };

  return Object.entries(replacements).reduce(
    (content, [token, value]) => content.replaceAll(token, escapeHtml(value)),
    template,
  );
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}
