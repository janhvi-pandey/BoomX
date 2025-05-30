import { useState, useEffect, useRef } from "react";
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
import Toast from "../reusable/toast";

const EmbedPlayer = ({ embedUrl, thumbnailUrl, title }) => {
  const [showIframe, setShowIframe] = useState(false);

  if (showIframe) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-[480px] rounded-md bg-black"
      />
    );
  }

  return (
    <div
      className="relative w-full h-[480px] cursor-pointer rounded-md overflow-hidden shadow-lg bg-black"
      onClick={() => setShowIframe(true)}
      aria-label={`Play ${title} video`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setShowIframe(true);
        }
      }}
    >
      <img
        src={thumbnailUrl}
        alt={`${title} thumbnail`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <svg
          className="w-20 h-20 text-white opacity-80"
          fill="currentColor"
          viewBox="0 0 84 84"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="42" cy="42" r="42" fill="currentColor" opacity="0.7" />
          <path d="M33 27L58 42L33 57V27Z" fill="black" />
        </svg>
      </div>
    </div>
  );
};

const isYouTubeUrl = (url) => {
  return /youtu\.?be/.test(url);
};

const getYouTubeEmbedUrl = (url) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/|shorts\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
};

const isVimeoUrl = (url) => {
  return /vimeo\.com/.test(url);
};

const isGoogleDriveUrl = (url) => {
  return /drive\.google\.com/.test(url);
};

const getDriveEmbedUrl = (url) => {
  const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }

  const altMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (altMatch && altMatch[1]) {
    return `https://drive.google.com/file/d/${altMatch[1]}/preview`;
  }
  return url;
};

const VideoPage = () => {
  const { id } = useParams();
  const { getVideoById, addComment, purchaseVideo, getWalletBalance,giftVideoCreator } = useVideo();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState({ name: "Anonymous" });
  const [purchased, setPurchased] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
const [toastMessage, setToastMessage] = useState("");

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

  const playVideo = () => videoRef.current?.play();
  const pauseVideo = () => videoRef.current?.pause();
  const forwardVideo = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };
  const backwardVideo = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

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

 const handleSendGift = async () => {
  if (!giftAmount || isNaN(giftAmount) || Number(giftAmount) <= 0) {
    setToastMessage("Please enter a valid amount");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1000);
    return;
  }

  try {
    const result = await giftVideoCreator(id, Number(giftAmount));
    if (result.success) {
      setToastMessage("Gift set successfully to user");
      setToastVisible(true);
      setGiftAmount("");
      setShowGiftModal(false);
      setTimeout(() => setToastVisible(false), 1000);
    } else {
      setToastMessage(result.message || "Failed to send gift");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1000);
    }
  } catch (error) {
    setToastMessage("Error sending gift. Please try again.");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1000);
  }
};
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

  const canWatch =
    video.short || purchased || !video.price || video.price === 0;

  const isNativeVideo = !(
    isYouTubeUrl(video.videoUrl) ||
    isVimeoUrl(video.videoUrl) ||
    isGoogleDriveUrl(video.videoUrl)
  );

  const renderVideoPlayer = () => {
    if (!canWatch) {
      return (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnail}
          controls={false}
          className="w-full max-h-[480px] rounded-md bg-black shadow-lg opacity-30 pointer-events-none"
        />
      );
    }

    if (isYouTubeUrl(video.videoUrl)) {
      return (
        <EmbedPlayer
          embedUrl={getYouTubeEmbedUrl(video.videoUrl)}
          thumbnailUrl={video.thumbnail}
          title={video.title}
        />
      );
    }

    if (isVimeoUrl(video.videoUrl)) {
      return (
        <EmbedPlayer
          embedUrl={video.videoUrl}
          thumbnailUrl={video.thumbnail}
          title={video.title}
        />
      );
    }

    if (isGoogleDriveUrl(video.videoUrl)) {
      return (
        <EmbedPlayer
          embedUrl={getDriveEmbedUrl(video.videoUrl)}
          thumbnailUrl={video.thumbnail}
          title={video.title}
        />
      );
    }

    return (
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        controls={false}
        className="w-full max-h-[480px] rounded-md bg-black shadow-lg"
      />
    );
  };

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

        <div className="flex justify-between items-center mb-10">
          <p className="text-lg font-medium text-gray-700">
            Get ready to dive in — turn up the volume, enjoy the ride & let us
            know what you think!
          </p>

          <button
            onClick={() => setShowGiftModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition font-semibold shadow"
          >
            Gift Creator
          </button>
        </div>

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
            {error && <p className="text-red-600 mt-3 font-medium">{error}</p>}
          </div>
        )}

        {renderVideoPlayer()}

        {isNativeVideo && (
          <div className="flex justify-center space-x-6 mt-4">
            <button
              onClick={backwardVideo}
              className="flex items-center gap-2 bg-[#622a6d] hover:bg-[#3c1743] text-white text-xl px-5 py-3 rounded-full shadow-md transition"
            >
              <IoPlayBackCircleSharp /> 10s
            </button>
            <button
              onClick={playVideo}
              className="flex items-center gap-2 bg-[#622a6d] hover:bg-[#3c1743] text-white text-xl px-5 py-3 rounded-full shadow-md transition"
            >
              <IoPlayCircle /> Play
            </button>
            <button
              onClick={pauseVideo}
              className="flex items-center gap-2 bg-[#622a6d] hover:bg-[#3c1743] text-white text-xl px-5 py-3 rounded-full shadow-md transition"
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
        )}
        <Toast message={toastMessage} visible={toastVisible} />


        {/* Comments Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-900">
            Comments
          </h2>

          <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700 transition font-medium shadow"
            >
              Post
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic">
              No comments yet. Be the first!
            </p>
          ) : (
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {comments.map((comment) => (
                <li
                  key={comment._id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium text-gray-700">
                      {comment.username || "Anonymous"}
                    </span>{" "}
                    • {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  <div className="text-gray-800 text-sm">{comment.content}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Gift Modal */}
        {showGiftModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowGiftModal(false)}
          >
            <div
              className="bg-white rounded-lg p-6 w-80 max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">
                Send Gift to Creator
              </h3>

              <input
                type="number"
                min="1"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter amount"
              />
              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="px-4 py-2 rounded border bg-gray-500 text-white "
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendGift}
                  className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 transition"
                >
                  Send Gift
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoPage;
