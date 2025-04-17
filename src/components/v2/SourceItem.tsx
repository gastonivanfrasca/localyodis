import { RoundedIdentifier } from "./RoundedIdentifier";
import { TrashCan } from "./TrashCan";

type SourceItemProps = {
  color: string;
  textColor: string;
  initial: string;
  video: boolean;
  name: string;
  trashCanCallback: () => void;
};

export const SourceItem = (props: SourceItemProps) => {
  const { color, textColor, initial, video, name, trashCanCallback } = props;
  return (
    <div className="flex items-center justify-between text-white px-4 py-3 rounded-xl shadow-sm transition-colors md:w-[400px] w-full bg-linear-to-r from-sky-900 to-indigo-900">
      <div className="flex items-center space-x-3">
        <RoundedIdentifier
          color={color}
          textColor={textColor}
          initial={initial}
          video={video}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm max-w-[200px] truncate">{name}</span>
        </div>
      </div>
      <TrashCan onClick={trashCanCallback} />
    </div>
  );
};
