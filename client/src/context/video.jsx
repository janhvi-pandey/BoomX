import { createContext, useContext } from "react";

const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const serverUrl = "http://localhost:5000";

  // Upload video function (existing)
  const uploadVideo = async (videoData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverUrl}/api/videos/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: videoData,
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  };

  // Fetch video by ID with comments
  const getVideoById = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverUrl}/api/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching video:", error);
      throw error;
    }
  };

  // Add comment to a video
  const addComment = async (videoId, commentContent) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverUrl}/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  return (
    <VideoContext.Provider value={{ uploadVideo, getVideoById, addComment }}>
      {children}
    </VideoContext.Provider>
  );
};

const useVideo = () => useContext(VideoContext);

export default useVideo;
