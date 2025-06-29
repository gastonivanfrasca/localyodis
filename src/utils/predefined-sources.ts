import { PredefinedSourcesData } from "../types/predefined-sources";

export const getPredefinedSources = (): PredefinedSourcesData => {
  return {
    "categories": [
      {
        "id": "tech",
        "name": "Technology",
        "icon": "monitor",
        "sources": [
          {
            "name": "TechCrunch",
            "url": "https://techcrunch.com/feed/",
            "description": "Startup and technology news"
          },
          {
            "name": "Ars Technica",
            "url": "https://feeds.arstechnica.com/arstechnica/index",
            "description": "Technology, science, and policy"
          },
          {
            "name": "The Verge",
            "url": "https://www.theverge.com/rss/index.xml",
            "description": "Technology, art, science, and culture"
          },
          {
            "name": "Wired",
            "url": "https://www.wired.com/feed/rss",
            "description": "Ideas that matter in technology"
          }
        ]
      },
      {
        "id": "news",
        "name": "News",
        "icon": "newspaper",
        "sources": [
          {
            "name": "BBC News",
            "url": "http://feeds.bbci.co.uk/news/rss.xml",
            "description": "International news from the BBC"
          },
          {
            "name": "Reuters",
            "url": "https://feeds.reuters.com/reuters/topNews",
            "description": "World news and business"
          },
          {
            "name": "NPR News",
            "url": "https://feeds.npr.org/1001/rss.xml",
            "description": "US public radio news"
          }
        ]
      },
      {
        "id": "science",
        "name": "Science",
        "icon": "microscope",
        "sources": [
          {
            "name": "NASA",
            "url": "https://www.nasa.gov/rss/dyn/breaking_news.rss",
            "description": "Latest news from NASA"
          },
          {
            "name": "Science Daily",
            "url": "https://www.sciencedaily.com/rss/all.xml",
            "description": "Scientific discoveries"
          },
          {
            "name": "New Scientist",
            "url": "https://www.newscientist.com/feed/home/",
            "description": "Science and technology"
          }
        ]
      },
      {
        "id": "design",
        "name": "Design",
        "icon": "palette",
        "sources": [
          {
            "name": "Smashing Magazine",
            "url": "https://www.smashingmagazine.com/feed/",
            "description": "Web design and development"
          },
          {
            "name": "Creative Bloq",
            "url": "https://www.creativebloq.com/feed",
            "description": "Art, design, and inspiration"
          },
          {
            "name": "Designer News",
            "url": "https://www.designernews.co/rss",
            "description": "Design community"
          }
        ]
      },
      {
        "id": "programming",
        "name": "Programming",
        "icon": "code",
        "sources": [
          {
            "name": "Dev.to",
            "url": "https://dev.to/feed",
            "description": "Developer community"
          },
          {
            "name": "Hacker News",
            "url": "https://hnrss.org/frontpage",
            "description": "Tech news and discussions"
          },
          {
            "name": "CSS-Tricks",
            "url": "https://css-tricks.com/feed/",
            "description": "CSS and frontend tips & tricks"
          },
          {
            "name": "JavaScript Weekly",
            "url": "https://javascriptweekly.com/rss/",
            "description": "Weekly JavaScript news"
          }
        ]
      },
      {
        "id": "business",
        "name": "Business",
        "icon": "trending-up",
        "sources": [
          {
            "name": "Harvard Business Review",
            "url": "https://feeds.hbr.org/harvardbusiness",
            "description": "Management and strategy ideas"
          },
          {
            "name": "Entrepreneur",
            "url": "https://www.entrepreneur.com/latest.rss",
            "description": "Entrepreneurship news"
          },
          {
            "name": "Fast Company",
            "url": "https://www.fastcompany.com/rss",
            "description": "Business and technology innovation"
          }
        ]
      }
    ]
  };
}; 