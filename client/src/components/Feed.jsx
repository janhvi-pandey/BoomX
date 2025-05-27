import React, { useRef, useEffect, useState, useCallback } from "react";
import { useVideoFeed } from "../context/VideoFeedContext";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { feed, fetchFeed, loading, hasMore } = useVideoFeed();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Remove duplicate videos by _id (if any)
  const uniqueFeed = Array.from(new Map(feed.map(v => [v._id, v])).values());

  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Play first video on load
  useEffect(() => {
    if (uniqueFeed.length > 0 && !playingVideoId) {
      const firstShort = uniqueFeed.find((v) => v.videoType === "short");
      setPlayingVideoId(firstShort ? firstShort._id : null);
    }
  }, [uniqueFeed, playingVideoId]);

  // Intersection Observer to switch playing video on scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const videos = containerRef.current.querySelectorAll("video");

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

    videos.forEach((video) => observer.observe(video));
    return () => videos.forEach((video) => observer.unobserve(video));
  }, [uniqueFeed, playingVideoId]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 150) {
      fetchFeed();
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
    >
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#843264] to-[#5c136a]">
        Boom Video Feed
      </h1>
      <div className="space-y-10">
        {uniqueFeed.length === 0 && !loading && (
          <p className="text-center">No videos available.</p>
        )}
        {uniqueFeed.map((video) => (
          <div
            key={video._id}
            className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => navigate(`/video/${video._id}`)}
            style={{ minHeight: 220 }}
          >
            {/* Left/top side */}
            <div className="w-full md:w-1/3 relative bg-black rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden">
              {video.videoType === "short" ? (
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
              ) : (
                <img
                  src={video.thumbnail || "/placeholder.png"}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Right/bottom side */}
            <div className="flex flex-col flex-grow p-6 space-y-3 text-white">
              <h2 className="text-2xl font-bold">{video.title}</h2>
              {video.description && (
                <p className="text-gray-300 text-base line-clamp-3">
                  {video.description}
                </p>
              )}
              <p className="text-sm text-gray-400">
                By <span className="font-semibold">{video.creatorName}</span>
              </p>

              <div className="mt-auto flex items-center justify-between">
                {video.isPaid && video.access === "buy" ? (
                  <button
                    className="bg-orange-600 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Redirect to buy page for ₹${video.price}`);
                    }}
                  >
                    Buy for ₹{video.price}
                  </button>
                ) : (
                  <button
                    className="bg-green-600 px-4 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/video/${video._id}`);
                    }}
                  >
                    Watch
                  </button>
                )}
                <span className="text-sm text-gray-400 italic">
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
                className="flex flex-col md:flex-row bg-gray-700 rounded-lg animate-pulse h-56"
              >
                <div className="w-full md:w-1/3 bg-gray-600 rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                <div className="flex-grow p-6 space-y-4">
                  <div className="h-8 bg-gray-600 rounded w-3/4" />
                  <div className="h-6 bg-gray-600 rounded w-full" />
                  <div className="h-5 bg-gray-600 rounded w-1/2" />
                  <div className="mt-auto h-8 bg-gray-600 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!hasMore && (
          <p className="text-center text-gray-500 mt-6 mb-10">No more videos.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
