import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVideoFeed } from "../context/VideoFeedContext";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

const VideoPage = () => {
  const { id } = useParams();
  const { feed } = useVideoFeed();
  const video = feed.find((v) => v._id === id);
  const videoRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState({ name: "Anonymous" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) setUser({ name: data.name });
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err.message);
        });
    }
  }, []);

  useEffect(() => {
    setComments([]);
    setNewComment("");
  }, [id]);

  if (!video) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Video not found</h1>
      </div>
    );
  }

  const playVideo = () => videoRef.current?.play();
  const pauseVideo = () => videoRef.current?.pause();
  const forwardVideo = () => (videoRef.current.currentTime += 10);
  const backwardVideo = () => (videoRef.current.currentTime -= 10);

  const addComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const timestamp = new Date().toLocaleString();
    const newEntry = {
      text: newComment.trim(),
      user: user.name,
      time: timestamp,
    };
    setComments((prev) => [...prev, newEntry]);
    setNewComment("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* BottomNav for small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full z-50">
        <BottomNav />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 ">

     <h1 className="text-4xl font-extrabold mb-2 mt-9 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-[#5c136a]">
  Boom Video: {video.title}
</h1>
<p className="text-lg font-medium text-gray-700 mb-10">
Get ready to dive in — turn up the volume, enjoy the ride & let us know what you think!</p>
        <h1 className="text-3xl font-bold text-gray-900">{video.title}</h1>

        {/* Video */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls={false}
          className="w-full max-h-[480px] rounded-md bg-black shadow-lg"
        />

        {/* Video Controls */}
        <div className="flex justify-center space-x-4">
          <button onClick={backwardVideo} className="video-btn">⏪ 10s</button>
          <button onClick={playVideo} className="video-btn">▶️ Play</button>
          <button onClick={pauseVideo} className="video-btn">⏸ Pause</button>
          <button onClick={forwardVideo} className="video-btn">10s ⏩</button>
        </div>

        {/* Comments Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-900">Comments</h2>

          <form onSubmit={addComment} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 rounded hover:bg-pink-700 transition"
            >
              Post
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet. Be the first!</p>
          ) : (
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {comments.map((comment, idx) => (
                <li
                  key={idx}
                  className="border border-gray-300 rounded p-3 bg-white break-words shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    {comment.user} • {comment.time}
                  </div>
                  <div className="text-gray-800">{comment.text}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default VideoPage;
