import React, { useRef, useEffect, useState, useCallback } from "react";
import { useVideoFeed } from "../context/VideoFeedContext";
import { useNavigate } from "react-router-dom";
import { BiSolidLike } from "react-icons/bi";
import { FaCommentDots } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

const Shorts = () => {
  const { feed, fetchFeed, loading, hasMore } = useVideoFeed();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

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
      className="w-full mx-auto h-screen overflow-y-auto p-4 bg-gradient-to-b from-white via-purple-50 to-white text-black"
    >
      <h1 className="text-4xl font-extrabold mb-2 text-center mt-6 text-[#5c136a]">
        Quick Flicks, Just for You!
      </h1>
      <p className="text-center text-sm text-gray-900 mb-9">
        Dive into short-form entertainment curated for your scroll!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 gap-y-10">
        {shortFeed.length === 0 && !loading && (
          <p className="text-center col-span-full">No short videos found...</p>
        )}

        {shortFeed.map((video) => (
          <div
            key={video._id}
            onClick={() => navigate(`/video/${video._id}`)}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 border border-gray-200 flex flex-col"
          >
            <div className="relative h-48 bg-black">
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
            </div>

            <div className="p-4 flex flex-col gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {video.title}
                </h2>
                <p
                  className="text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ height: "1.25rem" }}
                  title={video.description}
                >
                  {video.description || " "}
                </p>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-3">
                  <img
                    src={video.creatorAvatar || "/user-avatar.png"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/user-avatar.png";
                    }}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {video.creatorName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(video.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span className="flex items-center gap-1">
                    <BiSolidLike className="text-[#5b5a5a]" />
                    {video.likes ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCommentDots className="text-[#5b5a5a]" />
                    {video.comments?.length ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <IoEye className="text-[#5b5a5a]" />
                    {video.views ?? 0}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/video/${video._id}`);
                }}
                className={`mt-4 w-full py-2 rounded-lg text-white font-semibold text-sm transition duration-150 ${
                  video.isPaid && video.access === "buy"
                    ? "bg-[#a93f5d] hover:bg-[#983451]"
                    : "bg-[#7d3c98] hover:bg-[#6c3483] "
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
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-xl h-72"
            />
          ))}

        {!hasMore && (
          <p className="text-center text-gray-500 col-span-full mt-6">
            No more shorts.
          </p>
        )}
      </div>
    </div>
  );
};

export default Shorts;
