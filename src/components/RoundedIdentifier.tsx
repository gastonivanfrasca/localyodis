type RoundedIdentifierProps = {
  color: string;
  textColor: string;
  initial: string;
};

export const RoundedIdentifier = (props: RoundedIdentifierProps) => {
  const { color, textColor, initial } = props;
  return (
    <div
      className="rounded-full flex items-center justify-center w-[20px] h-[20px]"
      style={{ backgroundColor: color }}
    >
      <p className="text-xs p-1" style={{ color: textColor }}>
        {initial}
      </p>
    </div>
  );
};
