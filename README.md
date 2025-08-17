# SecureSphere

A collaborative, community-driven platform to detect, report, and resolve payment scams—empowering users to protect themselves and their network.

## Features

- **User Authentication:** Secure JWT-based login and registration.
- **Friend Management:** Add, remove, and search friends; bi-directional relationship system.
- **Fraud Reporting:** Report suspicious users with detailed reasons.
- **Network Fraud Feed:** View reports from your friends and extended network.
- **Dispute Resolution:** Dispute fraud reports; cases reviewed by admins.
- **Admin Dashboard:** Manage, confirm, or reject fraud cases and disputes.
- **Real-time Notifications:** Get instant alerts for fraud reports, disputes, or resolutions (uses Socket.io).

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Real-time:** Socket.io

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation

#### 1. Clone the repository

git clone https://github.com/yourusername/securesphere.git
cd securesphere

text

#### 2. Backend Setup

cd backend
npm install

Create a .env file and add your MongoDB connection string and JWT secret
npm start

text

#### 3. Frontend Setup

cd frontend
npm install
npm start

text

## Environment Variables

Create a `.env` file in the `backend` directory with:

MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret

text

## Usage

- Register/login to access the dashboard.
- Add friends and report users suspected of fraudulent activity.
- View live fraud reports from your network and receive real-time notifications.
- If mistakenly reported, file a dispute to get your case reviewed by an admin.

## Contribution

Pull requests are welcome! For major changes, please open an issue to discuss what you would like to change.

## License

[MIT](LICENSE)
