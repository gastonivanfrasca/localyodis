type TrashCanProps = {
  onClick: () => void;
};

export const TrashCan = (props: TrashCanProps) => {
  const { onClick } = props;
  return (
    <button
      className="text-zinc-400 hover:text-red-500 cursor-pointer"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 9.75l-.637 9.555a1.5 1.5 0 01-1.493 1.445H6.63a1.5 1.5 0 01-1.493-1.445L4.5 9.75m16.5-4.5h-5.25m0 0V3.375A1.875 1.875 0 0013.875 1.5h-3.75A1.875 1.875 0 008.25 3.375V5.25m0 0H3.75M9.75 9.75v7.5m4.5-7.5v7.5"
        />
      </svg>
    </button>
  );
};
