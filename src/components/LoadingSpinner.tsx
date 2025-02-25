import { LoaderCircle } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-row gap-2 items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <LoaderCircle className="animate-spin"/> 
      <p>Loading...</p>
    </div>
  );
};
