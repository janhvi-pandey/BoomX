import { createContext, useContext } from "react";

const VideoContext = createContext(null);

export const VideoProvider = ({children}) => {

    const serverUrl = "http://localhost:5000";

    const uploadVideo = async (videoData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${serverUrl}/api/videos/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: videoData
            })

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error uploading video:", error);
            throw error;
        }
    }

    return (
        <VideoContext.Provider value={{uploadVideo}}>
            {children}
        </VideoContext.Provider>
    )
}

const useVideo = () => useContext(VideoContext);

export default useVideo;