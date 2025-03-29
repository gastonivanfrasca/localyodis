type RoundedIdentifierProps = {
  color: string;
  textColor: string;
  initial: string;
  video: boolean;
};

export const RoundedIdentifier = (props: RoundedIdentifierProps) => {
  const { color, textColor, initial, video } = props;
  const roundedClass = video ? "rounded-md" : "rounded-full";
  return (
    <div
      className={`${roundedClass} flex items-center justify-center w-[20px] h-[20px]`}
      style={{ backgroundColor: color }}
    >
      <p className="text-xs p-1" style={{ color: textColor }}>
        {initial}
      </p>
    </div>
  );
};
