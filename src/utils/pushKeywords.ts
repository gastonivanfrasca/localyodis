const MAX_KEYWORD_FILTERS = 20;
const MAX_KEYWORD_LENGTH = 80;

const normalizeKeyword = (value: string) => {
  return value.trim().replace(/\s+/g, " ");
};

const getKeywordKey = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};

export const parseKeywordFilters = (input: string) => {
  const seen = new Set<string>();

  return input
    .split(/[\n,]+/)
    .map(normalizeKeyword)
    .filter((keyword) => keyword.length > 0)
    .filter((keyword) => keyword.length <= MAX_KEYWORD_LENGTH)
    .filter((keyword) => {
      const key = getKeywordKey(keyword);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, MAX_KEYWORD_FILTERS);
};

export const formatKeywordFilters = (keywords: string[]) => {
  return keywords.join(", ");
};

export const keywordFiltersEqual = (left: string[], right: string[]) => {
  return (
    left.length === right.length &&
    left.every((keyword, index) => keyword === right[index])
  );
};

export { MAX_KEYWORD_FILTERS, MAX_KEYWORD_LENGTH };
