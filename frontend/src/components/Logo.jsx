const LOGO_URL = "https://assets.wotaro.co.uk/logo.png";

function Logo({ width = 160, className = "" }) {
  return (
    <img
      src={LOGO_URL}
      alt="VenueOS"
      width={width}
      className={className}
      style={{ height: "auto" }}
    />
  );
}

export default Logo;