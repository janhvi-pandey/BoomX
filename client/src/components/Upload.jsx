import React, { useState } from 'react';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('short');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Uploading ${type} video titled "${title}"`);
   
  };

  return (
    <div className="max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 sm:p-10 shadow-xl mt-6 text-white">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-pink-300">
        Upload Your <span className="text-white">BoomX</span> Creation
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title"
            required
            className="rounded-md p-3 bg-purple-50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Video description"
            rows={4}
            className="rounded-md p-3 bg-purple-50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-md p-3 bg-purple-50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="short">Short</option>
            <option value="long">Long</option>
          </select>
        </label>

        {type === 'short' ? (
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Upload MP4 file
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="text-pink-100"
            />
          </label>
        ) : (
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Video URL
            <input
              type="url"
              placeholder="Enter video URL"
              onChange={(e) => setFile(e.target.value)}
              required
              className="rounded-md p-3 bg-purple-50 text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </label>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-[#9d3a75] via-[#7b1c8f] to-[#4d004d] hover:from-[#7b1c8f] hover:via-[#6a0070] hover:to-[#3d003d] text-white font-bold py-3 rounded-lg transition-all duration-300"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
