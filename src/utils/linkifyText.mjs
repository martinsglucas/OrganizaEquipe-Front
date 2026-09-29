const URL_CANDIDATE_PATTERN = /https?:\/\/[^\s<>"']+/giu;
const HTML_LIKE_PATTERN = /<[^>\n]*>/gu;
const TRAILING_PUNCTUATION_PATTERN = /[.,!?;:]+$/u;
const BRACKET_PAIRS = [
  ["(", ")"],
  ["[", "]"],
  ["{", "}"],
];

const countCharacter = (value, character) =>
  Array.from(value).filter((current) => current === character).length;

const trimTrailingPunctuation = (candidate) => {
  let url = candidate;
  let trailingText = "";
  let changed = true;

  while (changed) {
    changed = false;

    const punctuation = url.match(TRAILING_PUNCTUATION_PATTERN)?.[0];
    if (punctuation) {
      url = url.slice(0, -punctuation.length);
      trailingText = `${punctuation}${trailingText}`;
      changed = true;
    }

    for (const [opening, closing] of BRACKET_PAIRS) {
      if (
        url.endsWith(closing) &&
        countCharacter(url, closing) > countCharacter(url, opening)
      ) {
        url = url.slice(0, -1);
        trailingText = `${closing}${trailingText}`;
        changed = true;
      }
    }
  }

  return { url, trailingText };
};

const isAbsoluteWebUrl = (value) => {
  try {
    const parsedUrl = new URL(value);
    return (
      (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") &&
      Boolean(parsedUrl.hostname)
    );
  } catch {
    return false;
  }
};

const appendText = (segments, value) => {
  if (!value) return;

  const previous = segments[segments.length - 1];
  if (previous?.type === "text") {
    previous.value += value;
  } else {
    segments.push({ type: "text", value });
  }
};

const appendLinkCandidates = (segments, text) => {
  let cursor = 0;

  for (const match of text.matchAll(URL_CANDIDATE_PATTERN)) {
    appendText(segments, text.slice(cursor, match.index));

    const candidate = match[0];
    const { url, trailingText } = trimTrailingPunctuation(candidate);
    if (isAbsoluteWebUrl(url)) {
      segments.push({ type: "link", value: url });
      appendText(segments, trailingText);
    } else {
      appendText(segments, candidate);
    }

    cursor = match.index + candidate.length;
  }

  appendText(segments, text.slice(cursor));
};

export const parseLinkSegments = (text = "") => {
  const segments = [];
  let cursor = 0;

  for (const match of text.matchAll(HTML_LIKE_PATTERN)) {
    appendLinkCandidates(segments, text.slice(cursor, match.index));
    appendText(segments, match[0]);
    cursor = match.index + match[0].length;
  }

  appendLinkCandidates(segments, text.slice(cursor));
  return segments;
};
