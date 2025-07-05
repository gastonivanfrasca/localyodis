import { RoundedIdentifier } from "./RoundedIdentifier";
import { TrashCan } from "./TrashCan";
import { useNavigate } from "react-router";

type SourceItemProps = {
  color: string;
  textColor: string;
  initial: string;
  video: boolean;
  name: string;
  sourceId: string;
  trashCanCallback: () => void;
};

export const SourceItem = (props: SourceItemProps) => {
  const { color, textColor, initial, video, name, sourceId, trashCanCallback } = props;
  const navigate = useNavigate();

  const handleSourceClick = () => {
    navigate(`/sources/${sourceId}`);
  };

  return (
    <div className="flex items-center justify-between border-2 border-zinc-300 dark:border-zinc-900 text-zinc-800 dark:text-white px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 w-full">
      <div className="flex items-center space-x-3">
        <RoundedIdentifier
          color={color}
          textColor={textColor}
          initial={initial}
          video={video}
        />
        <div className="flex flex-col">
          <button
            onClick={handleSourceClick}
            className="font-semibold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
          >
            {name}
          </button>
        </div>
      </div>
      <TrashCan onClick={trashCanCallback} />
    </div>
  );
};
