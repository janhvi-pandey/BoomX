import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const VideoFeedContext = createContext(null);

export const VideoFeedProvider = ({ children }) => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async () => {
    // const serverUrl = "http://localhost:5000";
    const serverUrl = "https://server-boom-x.vercel.app";

    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${serverUrl}/api/feed/videos?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      // console.log(data)
      if (res.ok) {
        setFeed((prev) => [...prev, ...data.feed]);
        if (data.feed.length < 10) setHasMore(false);
        setPage((p) => p + 1);
      } else {
        console.error(data.message);
      }
    } catch (e) {
      console.error("Failed to fetch feed", e);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <VideoFeedContext.Provider value={{ feed, fetchFeed, loading, hasMore }}>
      {children}
    </VideoFeedContext.Provider>
  );
};

export const useVideoFeed = () => useContext(VideoFeedContext);
