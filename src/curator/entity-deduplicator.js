/**
 * ENTITY DEDUPLICATOR
 * Resolves divergent business names, merges duplicate listings,
 * and canonicalizes corporate identities across heterogeneous data feeds.
 */

class EntityDeduplicator {
  /**
   * Normalizes a business name by removing legal suffixes, punctuation and accents
   */
  normalizeName(name = '') {
    return name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\b(s\.a\.s\.?|s\.a\.?|ltda\.?|gmbh|llc|inc\.?|s\.l\.?|sarl|corp\.?|e\.u\.?)\b/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculates Levenshtein Distance between two strings
   */
  levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /**
   * Computes string similarity score between 0.0 and 1.0
   */
  similarityScore(str1, str2) {
    const norm1 = this.normalizeName(str1);
    const norm2 = this.normalizeName(str2);

    if (norm1 === norm2) return 1.0;
    if (!norm1 || !norm2) return 0.0;

    const maxLen = Math.max(norm1.length, norm2.length);
    const dist = this.levenshteinDistance(norm1, norm2);
    return Math.max(0, 1 - (dist / maxLen));
  }

  /**
   * Deduplicates an array of raw business places
   */
  deduplicatePlaces(places = [], threshold = 0.75) {
    const canonicalList = [];

    for (const place of places) {
      let isDuplicate = false;

      for (const canonical of canonicalList) {
        const sim = this.similarityScore(place.name, canonical.name);
        const phoneMatch = place.formatted_phone_number && canonical.formatted_phone_number &&
          place.formatted_phone_number.replace(/[^0-9]/g, '') === canonical.formatted_phone_number.replace(/[^0-9]/g, '');

        if (sim >= threshold || phoneMatch) {
          isDuplicate = true;
          // Merge rich attributes
          canonical.reviews_count = Math.max(canonical.reviews_count || 0, place.reviews_count || 0, place.user_ratings_total || 0);
          canonical.rating = Math.max(canonical.rating || 0, place.rating || 0);
          canonical.website = canonical.website || place.website;
          canonical.formatted_phone_number = canonical.formatted_phone_number || place.formatted_phone_number;
          if (place.reviews_snippets) {
            canonical.reviews_snippets = Array.from(new Set([...(canonical.reviews_snippets || []), ...place.reviews_snippets]));
          }
          break;
        }
      }

      if (!isDuplicate) {
        canonicalList.push({ ...place });
      }
    }

    return canonicalList;
  }
}

module.exports = new EntityDeduplicator();
