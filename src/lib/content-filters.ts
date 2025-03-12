/**
 * Content filtering utilities for Konstituzzjoni.mt
 * 
 * This file contains functions and data for filtering inappropriate content
 * and managing how such content is handled in search and analytics.
 */

// These terms won't be recorded in analytics but won't trigger a warning
export const ANALYTICS_BLACKLIST_TERMS: string[] = [
  // Security-related terms
  "hack", "exploit", "vulnerability", "password", "security", "breach", "sql injection", "xss",
  "ddos", "attack", "loophole", "bypass", "authenticate", "authentication", "authorization",
  "exploit", "vulnerability", "admin", "administrator", "decrypt", "encryption", "firewall",
  // Personal data related terms
  "personal data", "email address", "phone number", "credit card", "bank account", 
  "personal information", "id card", "identity card", "passport", "residence",
  // System commands
  "sudo", "cmd", "command", "terminal", "powershell", "bash", "shell", "console",
  // Maltese specific sensitive terms
  "karta identita", "karta tal-identita", "karta ta' l-identita"
];

// These terms will both not be recorded AND will trigger the friendly popup
export const INAPPROPRIATE_SEARCH_TERMS: string[] = [
  // English offensive terms
  "porn", "pornography", "sex", "sexual", "xxx", "obscenity", "obscene", "vulgar", "offensive",
  "fuck", "fucking", "fucked", "f**k", "f*ck", "fck", "fuk", "fuking", "shit", "sh*t", "sh1t",
  "ass", "asshole", "a$$", "arse", "penis", "vagina", "dick", "cock", "pussy", "cunt", "c*nt",
  "bitch", "b*tch", "b1tch", "bastard", "whore", "slut", "piss", "wank", "masturbate", 
  "nude", "naked", "boobs", "tits", "titties", "nipple", "clit", "clitoris", "erect",
  
  // Maltese offensive terms (with both standard and Maltese keyboard variants)
  // ħara / hara variants
  "ħara", "hara", "kaka", "hara", "ħara kbira", "hara kbira",
  
  // zobbi / zobi variants
  "zobbi", "zobi", "żobbi", "zobbi", "żobi", "żobb", "zobb",
  
  // liba / liba variants  
  "liba", "lieba", "l-iba",
  
  // foxx/fokk variants
  "foxx", "fokk", "fock", "fok", "foxx ommok", "fok ommok", "foxx ommok", "fokk ommok",
  "foxx il-madonna", "fok il-madonna", "foxx alla", "fok alla",
  
  // Various Maltese phrases and slang
  "kemm ghandek", "kemm għandek", "tronga", "pufta", "puftu", "pufti", "pastizz", "pastiz",
  "pajplejt", "pajplejter", "gahan", "għahan", "muqran", "beżżul", "bezzul", "bezul",
  "aħlib", "ahlib", "aqleb", "iblah", "iblaħ", "moħħ", "mohh", "bla moħħ", "bla mohh",
  "għatba", "ghatba", "qahba", "qaħba", "cajta", "ċajta", 
  
  // Mixed terms Maltese/English
  "stupid law", "stupid constitution", "stupid government", "stupid malta",
  "legalise drugs", "legalize drugs", "legalise cannabis", "legalize cannabis",
  "constitution sucks", "kostituzzjoni sucks", "kostituzzjoni stupid", "kostituzzjoni gay",
  "liġi stupid", "ligi stupid", "liġi gay", "ligi gay"
];

/**
 * Checks if a search term should be excluded from analytics tracking
 * @param term The search term to check
 * @returns boolean True if the term should NOT be tracked in analytics
 */
export function shouldFilterFromAnalytics(term: string): boolean {
  if (!term) return false;
  
  const normalizedTerm = term.toLowerCase().trim();
  
  // First check analytics-only blacklist
  const isInAnalyticsBlacklist = ANALYTICS_BLACKLIST_TERMS.some(
    blacklistedTerm => normalizedTerm.includes(blacklistedTerm)
  );
  
  // Then check inappropriate terms list
  const isInappropriate = INAPPROPRIATE_SEARCH_TERMS.some(
    inappropriateTerm => normalizedTerm.includes(inappropriateTerm)
  );
  
  return isInAnalyticsBlacklist || isInappropriate;
}

/**
 * Checks if a search term contains inappropriate content
 * @param term The search term to check
 * @returns boolean True if the term contains inappropriate content
 */
export function isInappropriateSearchTerm(term: string): boolean {
  if (!term) return false;
  
  const normalizedTerm = term.toLowerCase().trim();
  
  return INAPPROPRIATE_SEARCH_TERMS.some(
    inappropriateTerm => normalizedTerm.includes(inappropriateTerm)
  );
} 