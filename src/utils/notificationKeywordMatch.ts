const normalizeForKeywordMatch = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};

const HTML_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: "\"",
};

const decodeHtmlEntities = (value: string) => {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    const normalizedEntity = entity.toLowerCase();

    if (normalizedEntity.startsWith("#x")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalizedEntity.startsWith("#")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return HTML_ENTITY_MAP[normalizedEntity] ?? match;
  });
};

export const sanitizeNotificationSearchableText = (value: string) => {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\bhttps?:\/\/\S+/gi, " ")
    .replace(/\bwww\.\S+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const tokenizeForKeywordMatch = (value: string) => {
  return normalizeForKeywordMatch(sanitizeNotificationSearchableText(value))
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 0);
};

const containsTokenSequence = (tokens: string[], queryTokens: string[]) => {
  if (queryTokens.length === 0 || queryTokens.length > tokens.length) {
    return false;
  }

  for (let index = 0; index <= tokens.length - queryTokens.length; index += 1) {
    const matches = queryTokens.every((token, queryIndex) => tokens[index + queryIndex] === token);

    if (matches) {
      return true;
    }
  }

  return false;
};

export const matchesNotificationKeyword = (searchableText: string, keyword: string) => {
  const searchableTokens = tokenizeForKeywordMatch(searchableText);
  const keywordTokens = tokenizeForKeywordMatch(keyword);

  return containsTokenSequence(searchableTokens, keywordTokens);
};

export const matchesNotificationKeywordFilters = (searchableText: string, keywordFilters: string[] | null | undefined) => {
  if (!keywordFilters || keywordFilters.length === 0) {
    return true;
  }

  return keywordFilters.some((keyword) => matchesNotificationKeyword(searchableText, keyword));
};
