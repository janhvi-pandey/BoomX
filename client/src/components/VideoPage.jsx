import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useVideo from "../context/video";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import {
  IoPlayCircle,
  IoPlayForwardCircleSharp,
  IoPlayBackCircleSharp,
  IoPauseCircleSharp,
} from "react-icons/io5";

const VideoPage = () => {
  const { id } = useParams();
  const { getVideoById, addComment, purchaseVideo, getWalletBalance } = useVideo();

  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState({ name: "Anonymous" });
  const [purchased, setPurchased] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 

  // Fetch user profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) setUser({ name: data.name });
        })
        .catch((err) => console.error("Failed to fetch profile:", err));
    }
  }, []);

  // Fetch video by ID whenever ID changes
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getVideoById(id)
      .then((data) => {
        if (!data || data.message) {
          console.error("Failed to fetch video:", data?.message);
          setVideo(null);
          setComments([]);
          setPurchased(false);
        } else {
          setVideo(data);
          setComments(data.comments || []);
          setPurchased(data.purchased || false); 
        }
      })
      .catch((err) => {
        console.error("Error loading video:", err);
      })
      .finally(() => setLoading(false));
  }, [id, getVideoById]);

  // Fetch wallet balance on mount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const balance = await getWalletBalance();
        setWallet(balance);
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
      }
    };
    fetchWallet();
  }, [getWalletBalance]);

  // Video control handlers
  const playVideo = () => videoRef.current?.play();
  const pauseVideo = () => videoRef.current?.pause();
  const forwardVideo = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };
  const backwardVideo = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const result = await addComment(id, newComment.trim());
      if (result?.comments) {
        setComments(result.comments);
        setNewComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Purchase video handler
  const handlePurchase = async () => {
    setError("");

    
    if (!video.price || video.price === 0) {
      setPurchased(true);
      return;
    }

    if (wallet < video.price) {
      setError("Insufficient balance to purchase this video.");
      return;
    }

    try {
      const result = await purchaseVideo(id);
      if (result.success) {
        setPurchased(true);
        setWallet((prev) => prev - video.price);
      } else {
        setError(result.message || "Purchase failed");
      }
    } catch (err) {
      console.error("Error purchasing video:", err);
      setError("Purchase failed. Please try again.");
    }
  };

  useEffect(() => {
  if (purchased && videoRef.current) {
    videoRef.current.play().catch((err) => {
      console.warn("Auto play prevented:", err);
    });
  }
}, [purchased]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Loading video...</h1>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Video not found</h1>
      </div>
    );
  }


  const canWatch = video.short || purchased || !video.price || video.price === 0;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 w-full z-50">
        <BottomNav />
      </div>

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-4xl font-extrabold mb-2 mt-9 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-[#5c136a]">
          Boom Video: {video.title}
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-10">
          Get ready to dive in — turn up the volume, enjoy the ride & let us know what you think!
        </p>

        {!canWatch && video.price > 0 && (
          <div className="mb-6 p-6 border border-purple-300 rounded-lg bg-purple-50 shadow-md">
            <p className="text-[#622a6d] font-semibold text-lg mb-4">
              This premium video costs{" "}
              <span className="font-bold">{video.price} coins</span> to unlock.
            </p>
            <button
              onClick={handlePurchase}
              className="bg-[#622a6d] text-white px-6 py-3 text-lg rounded hover:bg-purple-800 transition font-semibold shadow-md"
            >
              Purchase & Watch
            </button>
            {error && (
              <p className="text-red-600 mt-3 font-medium">
                {error}
              </p>
            )}
          </div>
        )}

        <video
          ref={videoRef}
          src={video.videoUrl}
          controls={false}
          className={`w-full max-h-[480px] rounded-md bg-black shadow-lg ${
            !canWatch ? "opacity-30 pointer-events-none" : ""
          }`}
        />

        <div className="flex justify-center space-x-6 mt-4">
          <button
            onClick={backwardVideo}
            className="flex items-center gap-2 bg-[#622a6d] hover:bg-[#3c1743] text-white text-xl px-5 py-3 rounded-full shadow-md transition"
          >
            <IoPlayBackCircleSharp /> 10s
          </button>
          <button
            onClick={playVideo}
            className="flex items-center gap-2 bg-[#622a6d] hover:bg-[#3c1743] text-white text-xl px-5 py-3 rounded-xl shadow-md transition"
          >
            <IoPlayCircle /> Play
          </button>
          <button
            onClick={pauseVideo}
            className="flex items-center gap-2 bg-[#622a6d] hover:bg-[#3c1743] text-white text-xl px-5 py-3 rounded-xl shadow-md transition"
          >
            <IoPauseCircleSharp /> Pause
          </button>
          <button
            onClick={forwardVideo}
            className="flex items-center gap-2 bg-[#622a6d] hover:bg-[#3c1743] text-white text-xl px-5 py-3 rounded-full shadow-md transition"
          >
            <IoPlayForwardCircleSharp /> 10s
          </button>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-900">
            Comments
          </h2>

          <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
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
              {comments.map((comment) => (
                <li
                  key={comment._id}
                  className="border border-gray-300 rounded p-3 bg-white break-words shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    {comment.username} •{" "}
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  <div className="text-gray-800">{comment.content}</div>
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
