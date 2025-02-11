export const fetchRSS = async (url: string) => {
  try {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    return xml;
  } catch (error) {
    console.log(error);
  }
};
