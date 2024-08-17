# webclicker

## Prerequisites

- .NET SDK 6.0+
- Node.js v16.0+

## Installation

1. **Clone the Repository**

   - git clone https://github.com/hajduty/webclicker.git
   - cd webclicker

2. **Install Dependencies**

   - **Backend**
     - cd backend
     - dotnet restore

   - **Frontend**
     - cd ../frontend
     - npm install

## Running

1. **Frontend**
   - cd frontend
   - npm run dev
   - Access at http://localhost:5173

2. **Backend**
   - cd backend
   - dotnet run
   - Access at https://localhost:7231

## Build & Deploy

1. **Build Backend**

   cd backend
   dotnet publish -c Release -o ./publish

2. **Build Frontend**

   cd frontend
   npm run build

3. **Deploy**

   - Backend: Deploy from backend/publish
   - Frontend: Serve from frontend/dist
