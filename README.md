
# Stream Bold. Connect Loud. Create Freely.😀

## Welcome to **BoomX**

Where creators unite, ideas ignite, and streams take flight. So let's stream, dream, and dive.

>  A full-stack video-sharing platform supporting short and long videos with real-time comments, AWS S3 integration, and a creator-first approach.

---

##  Project Overview

BoomX is a MERN-stack video streaming platform that allows users to register, log in, upload videos, watch content, and engage via comments. It supports both short-form and long-form video formats with a smooth UI powered by React and efficient backend APIs.

---

##  Project Structure

```

BoomX/
├── client/ # Frontend (React)
└── server/ # Backend (Express + MongoDB)


```

## Client Folder
```

client/
├── public/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Shorts.jsx
│   │   ├── Feed.jsx
│   │   ├── Upload.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VideoPage.jsx
│   │   └── LandingPage.jsx
│   ├── reusable/
│   │   └── Toast.jsx
│   ├── context/
│   │   ├── video.jsx
│   │   └── VideoFeedContext.jsx
│   └── App.jsx

```

---

##  Tech Stack

* **Frontend:** React, Tailwind CSS, React Router
* **Backend:** Node.js, Express, MongoDB
* **Authentication:** JWT, bcrypt
* **Cloud Storage:** AWS S3 (for video uploads)
* **State Management:** React Context API

---

##  Frontend Overview

###  Main Components

* **Dashboard.jsx**
  The main page for authenticated users, showing navigation for shorts, feeds, and uploads.

* **LandingPage.jsx**
  Public-facing welcome page of BoomX, introducing the platform.

* **Login.jsx / Register.jsx**
  Handles user authentication with form validation and toast messages.

* **Shorts.jsx**
  Displays short-form videos in a scrollable, mobile-friendly view.

* **Feed.jsx**
  Infinite scroll feed showing all uploaded long-form videos.

* **Upload.jsx**
  A form that allows users to upload videos. Integrates with AWS S3.

* **VideoPage.jsx**
  Dedicated page for a single video along with its comments and metadata.

* **Sidebar.jsx / BottomNav.jsx**
  Responsive navigation UI components for both desktop and mobile.

* **Toast.jsx**
  A reusable component to show toast messages on login, register, or upload success.

---
### Frontend Setup

```bash

cd client
npm install
npm run dev
Visit: http://localhost:5173

```
###  Context APIs

####  `video.jsx`

Handles video-specific actions:

* `uploadVideo(videoData)` — Uploads video to AWS S3 and backend.
* `getVideoById(videoId)` — Fetches a single video and its comments.
* `addComment(videoId, commentContent)` — Adds a new comment to a video.

####  `VideoFeedContext.jsx`

Manages video feed with infinite scrolling:

* Stores fetched video feed data.
* Auto-fetches more content when user scrolls.
* Pagination logic for seamless content flow.

---

##  Features Implemented

*  Secure Authentication (JWT-based)
*  Upload & store videos via AWS S3
*  React Context for managing feed & videos
*  Add & fetch comments in real-time
* Infinite scroll for feed browsing
*  Fully responsive and mobile-friendly UI
*  Modular, scalable frontend component structure

---

## 🔗 Backend 

### Prerequisites
- Node.js
- MongoDB
- AWS S3 Bucket
- `.env` file with the following (example):

- MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/boomx
- JWT_SECRET=your_jwt_secret_key
- AWS_REGION=your-region
- AWS_BUCKET_NAME=your-bucket-name
- AWS_ACCESS_KEY=your-access-key
- AWS_SECRET_ACCESS_KEY=your-secret


### Backend Setup:

```bash
cd server
npm install
nodemon server.js
API Base URL: http://localhost:5000

```

### Responsibilities:
- User registration and authentication
- File uploads to AWS S3
- Create/read videos and comments
- Secure endpoints using JWT
- Paginated video feeds

---
## Server Folder
```
server/
├── models/
│ ├── User.js    - User schema (name, email, password, purchasedVideos)
│ └── Video.js   -  Video schema (title, creator, comments, pricing)
│
├── config/
│ └── db.js      -  MongoDB connection logic
│
├── middleware/
│ ├── verifyToken.js   -  JWT token verification middleware
│ └── multerUpload.js  -  Multer config for handling file uploads
│
├── routes/
│ ├── auth.js         -  /register, /login, /profile routes
│ ├── videoRoutes.js  -  Upload videos, get by ID, post comments
│ └── feedRoutes.js   -  Paginated feed retrieval
│
├── services/
│ └── awsUploader.js  -  Upload to AWS S3 using SDK
│
└── server.js         - Main Express server config

```
## API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint         | Description                    | Body                            |
|--------|------------------|--------------------------------|----------------------------------|
| POST   | `/register`      | Register a new user            | `{ name, email, password }`     |
| POST   | `/login`         | Log in a user                  | `{ email, password }`           |
| GET    | `/profile`       | Get logged-in user's profile   | (JWT token in headers)          |



###  Video Routes (`/api/videos`)

| Method | Endpoint             | Description                               | Body / Files / Notes                                                                                                      |
| ------ | -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/upload`            | Upload a video (short or long)            | **FormData**: `title`, `description`, `videoType`, `isPaid`, `price`, `videoFile`, `thumbnail` <br>**Headers**: JWT Token |
| `GET`  | `/:id`               | Get video by ID with creator and comments | **Headers**: JWT Token                                                                                                    |
| `POST` | `/:id/comments`      | Add a comment to a video                  | **Body**: `{ content }` <br>**Headers**: JWT Token                                                                        |
| `POST` | `/:videoId/purchase` | Purchase a paid video                     | **Headers**: JWT Token                                                                                                    |
| `POST` | `/gift/:videoId`     | Gift money to the video creator           | **Body**: `{ amount }` <br>**Headers**: JWT Token                                                                         |

---


### Feed Routes (`/api/feed`)
| Method | Endpoint         | Description                       | Query           |
|--------|------------------|-----------------------------------|-----------------|
| GET    | `/videos`        | Get paginated feed of videos      | `?page=1&limit=10` |

---



## Features

- User Authentication (JWT)
- Upload short and long videos
- Upload files to AWS S3
- View feeds with pagination
- Add and view comments
- Mobile-responsive UI
- Modular React + Express architecture

---

##  Contact

If you have any questions, suggestions, or would like to contribute, feel free to reach out:

**[shivipandey993@gmail.com](mailto:shivipandey993@gmail.com)**

Pull requests and feedback are always welcome.

---

### Thankyou 💫