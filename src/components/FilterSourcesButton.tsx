import { ListFilter } from "lucide-react";
import { Navigations } from "../types/navigation";

type FilterSourcesButtonProps = {
  navigation: Navigations;
  setNavigation: (value: Navigations) => void;
};

export const FilterSourcesButton = (props: FilterSourcesButtonProps) => {
  const { navigation, setNavigation } = props;

  if (navigation === Navigations.FILTER_SOURCES) {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          setNavigation(Navigations.HOME);
        }}
      >
        <ListFilter style={{ color: "#1e7bc0" }} />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setNavigation(Navigations.FILTER_SOURCES);
      }}
      className="cursor-pointer"
    >
      <ListFilter className="text-gray-800 dark:text-gray-400" />
    </button>
  );
};
