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
    <div className="flex items-center justify-between border-2 border-zinc-300 dark:border-zinc-900 text-zinc-800 dark:text-white px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors md:w-[400px] w-full">
      <div className="flex items-center space-x-3">
        <RoundedIdentifier
          color={color}
          textColor={textColor}
          initial={initial}
          video={video}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{name}</span>
        </div>
      </div>
      <TrashCan onClick={trashCanCallback} />
    </div>
  );
};
