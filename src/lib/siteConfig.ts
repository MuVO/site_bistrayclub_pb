const env = import.meta.env;

export const siteConfig = {
  siteDomain: env.PUBLIC_SITE_DOMAIN ?? '',
  contactFunctionUrl: env.PUBLIC_CONTACT_FUNCTION_URL ?? '',
  phoneNumber: env.PUBLIC_PHONE_NUMBER ?? '',
  clubAddress: env.PUBLIC_CLUB_ADDRESS ?? '',
  openingHours: env.PUBLIC_OPENING_HOURS ?? '',
  pricePerPlayer: env.PUBLIC_PRICE_PER_PLAYER ?? '',
  minPlayers: env.PUBLIC_MIN_PLAYERS ?? '',
  includedBalls: env.PUBLIC_INCLUDED_BALLS ?? '',
};

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
