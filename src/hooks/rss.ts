import { useEffect, useState } from "react";

export const useRssData = (url: string) => {
  const [rssData, setRssData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://cors-anywhere.herokuapp.com/${url}`
        );
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        setRssData(xml);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { rssData, loading, error };
};
