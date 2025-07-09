import { Rss, TvMinimalPlay } from "lucide-react";

type RoundedIdentifierProps = {
  color: string;
  textColor: string;
  initial: string;
  video: boolean;
  small?: boolean;
  extraSmall?: boolean;
};

export const RoundedIdentifier = (props: RoundedIdentifierProps) => {
  const { color, textColor, initial, video, small, extraSmall } = props;

  const size = extraSmall 
    ? "w-4 h-4 text-xs" 
    : small 
      ? "w-5 h-5 text-xs" 
      : "w-10 h-10";
      
  const badgeSize = extraSmall
    ? "w-1.5 h-1.5 bottom-0 right-0"
    : small 
      ? "w-2 h-2 bottom-0 right-0" 
      : "w-4 h-4 bottom-0 right-0";

  const badge = video ? (
    <VideoBadge color={color} small={small} extraSmall={extraSmall} />
  ) : (
    <TextBadge color={color} small={small} extraSmall={extraSmall} />
  );

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-bold shadow-sm ${size}`}
      style={{ backgroundColor: color, color: textColor }}
    >
      {initial}
      <div
        className={`absolute ${badgeSize} opacity-90 bg-white rounded-full flex items-center justify-center shadow-lg`}
        style={{ backgroundColor: color, color: textColor }}
      >
        {badge}
      </div>
    </div>
  );
};

type BadgeProps = {
  color: string;
  small?: boolean;
  extraSmall?: boolean;
};

const VideoBadge = (props: BadgeProps) => {
  const { small, extraSmall } = props;
  const size = extraSmall ? "w-1.5 h-1.5" : small ? "w-1.5 h-1.5" : "w-3 h-3";
  return <TvMinimalPlay className={`white ${size}`} />;
};

const TextBadge = (props: BadgeProps) => {
  const { small, extraSmall } = props;
  const size = extraSmall ? "w-1.5 h-1.5" : small ? "w-1.5 h-1.5" : "w-3 h-3";
  return <Rss className={`white ${size}`} />;
};
