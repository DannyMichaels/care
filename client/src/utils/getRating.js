export default function getRating(ratingParam, iconParam = "⭐") {
  return Array(ratingParam)
    .fill()
    .map((_, i) => (
      <span role="img" aria-label="rating" key={i}>
        {iconParam}&#8199;
      </span>
    ));
}
