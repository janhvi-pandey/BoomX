import React, { useRef, useEffect, useState, useCallback } from "react";
import { useVideoFeed } from "../context/VideoFeedContext";
import { useNavigate } from "react-router-dom";

const Shorts = () => {
  const { feed, fetchFeed, loading, hasMore } = useVideoFeed();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Filter shorts and remove duplicates
  const shortFeed = Array.from(
    new Map(
      feed
        .filter((video) => video.videoType === "short")
        .map((video) => [video._id, video])
    )
  ).map(([, video]) => video);

  useEffect(() => {
    if (shortFeed.length > 0 && !playingVideoId) {
      setPlayingVideoId(shortFeed[0]._id);
    }
  }, [shortFeed, playingVideoId]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && video.dataset.type === "short") {
            setPlayingVideoId(video.dataset.id);
          } else if (video.dataset.type === "short") {
            if (playingVideoId === video.dataset.id) setPlayingVideoId(null);
          }
        });
      },
      { threshold: 0.7 }
    );

    const videos = containerRef.current.querySelectorAll("video");
    videos.forEach((video) => observer.observe(video));

    return () => videos.forEach((video) => observer.unobserve(video));
  }, [shortFeed, playingVideoId]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 150) {
      fetchFeed(); // Load more shorts
    }
  }, [loading, hasMore, fetchFeed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto h-screen overflow-y-auto p-6 bg-white text-black"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <h1 className="text-4xl font-extrabold mb-2 mt-9 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-[#5c136a]">
        Quick Flicks, Just for You!
      </h1>
      <p className="text-lg font-medium text-gray-700 mb-10 ">
        Dive into the best short-form videos — fast, fun, and made to binge.
      </p>

      <div className="space-y-10">
        {shortFeed.length === 0 && !loading && (
          <p className="text-center">No short videos found.</p>
        )}

        {shortFeed.map((video) => (
          <div
            key={video._id}
            className="flex flex-col md:flex-row bg-white text-black border-x-2 border-black rounded-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/video/${video._id}`)}
            style={{ minHeight: 220 }}
          >
            <div className="w-full md:w-1/3 relative bg-black rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden">
              <video
                data-id={video._id}
                data-type="short"
                src={video.videoUrl}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                autoPlay={playingVideoId === video._id}
                controls={false}
              />
            </div>

            <div className="flex flex-col flex-grow p-6 space-y-3 text-black">
              <h2 className="text-2xl font-bold">{video.title}</h2>
              {video.description && (
                <p className="text-gray-700 text-base line-clamp-3">
                  {video.description}
                </p>
              )}
              <p className="text-sm text-gray-600">
                By <span className="font-semibold">{video.creatorName}</span>
              </p>

              <div className="mt-auto flex items-center justify-between">
                <button
                  className="bg-[#721b83] text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-[#5c136a] transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/video/${video._id}`);
                  }}
                >
                  Watch 
                </button>
                <span className="text-sm text-gray-500 italic">
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row bg-gray-300 rounded-lg animate-pulse h-56"
              >
                <div className="w-full md:w-1/3 bg-gray-400 rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                <div className="flex-grow p-6 space-y-4">
                  <div className="h-8 bg-gray-400 rounded w-3/4" />
                  <div className="h-6 bg-gray-400 rounded w-full" />
                  <div className="h-5 bg-gray-400 rounded w-1/2" />
                  <div className="mt-auto h-8 bg-gray-400 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!hasMore && !loading && (
          <p className="text-center text-gray-500 mt-6 mb-10">
            No more shorts.
          </p>
        )}
      </div>
    </div>
  );
};

export default Shorts;
