import { parseLinkSegments } from "../utils/linkifyText.mjs";

function SafeLinkText({ text }) {
  return parseLinkSegments(text).map((segment, index) =>
    segment.type === "link" ? (
      <a
        key={`${segment.value}-${index}`}
        href={segment.value}
        target="_blank"
        rel="noopener noreferrer"
      >
        {segment.value}
      </a>
    ) : (
      segment.value
    )
  );
}

export default SafeLinkText;
