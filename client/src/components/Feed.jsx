import React, { useRef, useEffect, useState, useCallback } from "react";
import { useVideoFeed } from "../context/VideoFeedContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";

const Feed = () => {
  const { feed, fetchFeed, loading, hasMore } = useVideoFeed();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const uniqueFeed = Array.from(new Map(feed.map((v) => [v._id, v])).values());
  const [playingVideoId, setPlayingVideoId] = useState(null);

  useEffect(() => {
    if (uniqueFeed.length > 0 && !playingVideoId) {
      const firstShort = uniqueFeed.find((v) => v.videoType === "short");
      setPlayingVideoId(firstShort ? firstShort._id : null);
    }
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
      className="w-full mx-auto h-screen overflow-y-auto p-4 bg-white text-black"
    >
      <h1 className="text-3xl font-bold mb-1 text-center text-[#5c136a]">Boom Video Feed</h1>
      <p className="text-center text-sm text-gray-500 mb-6">Your daily dose of entertaining, insightful, and trending videos!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueFeed.length === 0 && !loading && (
          <p className="text-center col-span-full">No videos available.</p>
        )}

        {uniqueFeed.map((video) => (
          <div
            key={video._id}
            onClick={() => navigate(`/video/${video._id}`)}
            className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition duration-200 border border-gray-200"
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              {video.videoType === "short" ? (
                <video
                  data-id={video._id}
                  data-type="short"
                  src={video.videoUrl}
                  muted
                  loop
                  playsInline
                  autoPlay={playingVideoId === video._id}
                  controls={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={video.thumbnail || "/placeholder.png"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={video.creatorAvatar || "/user-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{video.creatorName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-900 truncate">{video.title}</h2>

              {/* Description (fixed height, single line, ellipsis) */}
              <p
                className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis"
                style={{ height: "1.25rem" }}
                title={video.description}
              >
                {video.description || " "}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-gray-500 text-sm pt-2">
                <span className="flex items-center gap-1">
                  <FaHeart className="text-red-500" />
                  {video.likes ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <FaComment />
                  {video.comments?.length ?? 0}
                </span>
                <span className="italic text-xs">{video.views ?? 0} views</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/video/${video._id}`);
                }}
                className={`mt-3 w-full py-2 rounded-lg text-white font-semibold text-sm transition duration-150 ${
                  video.isPaid && video.access === "buy"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {video.isPaid && video.access === "buy"
                  ? `Buy for ₹${video.price}`
                  : "Watch"}
              </button>
            </div>
          </div>
        ))}

        {loading &&
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-72" />
          ))}

        {!hasMore && (
          <p className="text-center text-gray-500 col-span-full mt-6">
            No more videos.
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;
