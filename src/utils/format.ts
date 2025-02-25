export const formatPubDate = (pubDate: string) => {
    const publicationDate = new Date(pubDate);
    const date = publicationDate.toLocaleDateString(undefined, {
      dateStyle: "short",
    });
    const time = publicationDate.toLocaleTimeString(undefined, {
      timeStyle: "short",
    });
    return `${date} - ${time}`;
  };
  
