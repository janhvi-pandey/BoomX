import React, { useState } from 'react';
import { FaCloudArrowUp } from "react-icons/fa6";
import useVideo from '../context/video';
import Toast from "../reusable/Toast";


const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('short');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState({ message: "", visible: false, type: "" });

  const { uploadVideo } = useVideo();

  const showToast = (message, type = "success") => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast({ message: "", visible: false, type: "" });
    }, 2000);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'video/mp4') {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('videoType', type);
      formData.append('isPaid', type === 'long' && price > 0);
      formData.append('price', price || 0);

      if (type === 'short') {
        formData.append('videoFile', file);
      } else {
        formData.append('videoUrl', videoURL);
        formData.append('thumbnail', thumbnail);
      }

      setUploading(true);
      const result = await uploadVideo(formData);

      showToast('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setType('short');
      setFile(null);
      setPrice('');
      setThumbnail(null);
      setVideoURL('');
    } catch (error) {
      showToast('Upload failed: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      <div className="text-center  lg:ml-4 mt-9 mb-8">
       
         <h1 className="text-3xl lg:text-4xl font-extrabold mb-2 mt-6 text-center text-[#5c136a]">
        Upload Your Creation
      </h1>
      <p className="text-center text-sm text-gray-900 mb-9">
      Share your stories, shorts, or full-length features with the BoomX community.
      </p>

      </div>

     <div className="w-full flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-lg shadow-xl rounded-xl lg:p-4 p-5 text-gray-700 border border-black">
        

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="text-sm font-semibold">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              required
              className="mt-1 w-full rounded-md p-2 bg-purple-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </label>

          <label className="text-sm font-semibold">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              rows={1}
              className="mt-1 w-full text-sm sm:text-base rounded-md p-2 bg-purple-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
          </label>

          <label className="text-sm font-semibold">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-md p-2 bg-purple-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </label>

          {type === 'short' ? (
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={`mt-2 border-2 border-gray-500 rounded-md p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${
                dragOver ? 'bg-pink-100/50' : 'bg-white/60'
              }`}
            >
              <FaCloudArrowUp className="text-fuchsia-700 text-3xl sm:text-4xl" />
              <p className="text-xs sm:text-sm font-medium text-black select-none">
                {file ? `File: ${file.name}` : 'Drag and drop your MP4 file here, or click to select'}
              </p>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer font-semibold text-fuchsia-900 text-sm sm:text-base select-none"
              >
                Browse files
              </label>
            </div>
          ) : (
            <>
              <label className="text-sm font-semibold">
                Price
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                  className="mt-1 w-full rounded-md p-2 bg-purple-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </label>

              <div
                className="w-full max-w-xl h-40 bg-white border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-100 transition"
                onClick={() => document.getElementById('thumbnailInput').click()}
              >
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-500">Click to select a thumbnail</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                id="thumbnailInput"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="hidden"
              />

              <label className="text-sm font-semibold mt-3">
                Video URL
                <input
                  type="url"
                  value={videoURL}
                  onChange={(e) => setVideoURL(e.target.value)}
                  placeholder="https://example.com/video"
                  required
                  className="mt-1 w-full rounded-md p-2 bg-purple-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-gradient-to-r from-[#9d3a75] via-[#7b1c8f] to-[#4d004d] hover:from-[#7b1c8f] hover:via-[#6a0070] hover:to-[#3d003d] text-white font-bold py-2 rounded-lg transition-all duration-300 mt-3 ${
              uploading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div></>
   
  );
};

export default Upload;
