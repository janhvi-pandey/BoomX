import { createContext, useContext } from "react";

const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const serverUrl = "http://localhost:5000";

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  };

  const getVideoById = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverUrl}/api/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch video failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching video:", error);
      throw error;
    }
  };

  const addComment = async (videoId, commentContent) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${serverUrl}/api/videos/${videoId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentContent }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Add comment failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const purchaseVideo = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverUrl}/api/videos/${videoId}/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Purchase failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error purchasing video:", error);
      throw error;
    }
  };

  const getWalletBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${serverUrl}/api/auth/wallet/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch wallet balance failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      throw error;
    }
  };

  const giftVideoCreator = async (videoId, amount) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${serverUrl}/api/videos/gift/${videoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gift failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error gifting video creator:", error);
    throw error;
  }
};




  return (
    <VideoContext.Provider
      value={{
        uploadVideo,
        getVideoById,
        addComment,
        purchaseVideo,
        getWalletBalance,
        giftVideoCreator,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

const useVideo = () => useContext(VideoContext);
export default useVideo;
