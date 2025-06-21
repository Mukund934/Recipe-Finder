
---

# 🍽️ Recipe Finder

🔎 Discover Meals Tailored to Your Taste

---

## 📖 Overview

Finding the perfect recipe can be time-consuming, especially when managing dietary needs or personal preferences. **Recipe Finder** solves this by offering a smart, responsive platform that helps users discover, explore, and save recipes tailored to their dietary lifestyles.

With powerful search filters, Spoonacular API integration, and secure user profiles, this full-stack web app is your personal cooking assistant — whether you're a seasoned chef or just getting started.



---

## 🌟 Features

### 🥗 Smart Recipe Search

Search by ingredients, cuisine, diet preferences (e.g., vegan, gluten-free), or ready time.

### 📋 Nutrition & Instructions

View full nutritional data, ingredients list, and cooking instructions for each recipe.

### ❤️ Save Favorites

Create an account and bookmark your favorite recipes with a single click.

### 👤 User Authentication

Secure login/register system with JWT-based authentication and MongoDB session storage.

### 📱 Responsive UI

Optimized experience for both desktop and mobile using **TailwindCSS** and **shadcn/ui**.
---


## 🚀 Live Project

🔗 **[Visit Recipe Finder →](https://recipe-finder-khaki-five.vercel.app/)**

---


## 🎥 Demo / Preview

> Below are GIF previews of the working application:

### Short preview gif 1

![Preview 1](.preview3-ezgif.gif)

### Short preview gif 2

![Preview 2](.preview4-ezgif.gif)

> For Complete full length HD video previews, visit the [📂 Google Drive Folder](https://drive.google.com/drive/folders/1pUX8T4M67cGgYlID7e_nJuD8_kHLmaXz?usp=sharing)

---

## 🛠️ How It Works

### 🧩 Frontend

* Built with **React + TypeScript**
* TailwindCSS and shadcn/ui for styling
* Axios for API handling
* Vite for fast builds

### 🔐 Backend

* **Node.js + Express.js**
* MongoDB for user data
* Drizzle ORM to manage favorites
* JWT for user authentication
* Hosted on **Vercel**

### 🌐 API

* Integrates with **Spoonacular API** to fetch real-time recipe data.

---

## 🚧 Challenges and ✅ Solutions

### 🔐 Authentication Security

Implemented JWT + environment-based secret handling for secure login.

### 🌍 API Rate Limits

Cached results and user preferences to reduce redundant API calls.

### 📦 Full-Stack Integration

Ensured seamless communication between client and server using RESTful routes and Axios interceptors.

---

## 🔮 Future Scope

* 📦 Add meal planner and grocery list generation
* 🍽️ Recipe sharing between users
* 🧠 AI-based recipe suggestions using user behavior
* 🌐 International recipe support with language filters
* 📱 PWA support for offline recipe access

---

## 🎯 Why Choose Recipe Finder?

✅ Personalized suggestions tailored to **you**
⚡ Fast and modern tech stack using Vite + Tailwind
🔐 Secure user login and preference management
📚 Nutrition-rich recipe results
📱 Fully responsive and optimized for all devices

---

## 🖥️ Installation

```bash
# Clone the repository
git clone https://github.com/Mukund934/Recipe-Finder.git
cd Recipe-Finder

# Install dependencies
npm install
```

### Create Environment Variables

#### `.env` (root)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SPOONACULAR_API_KEY=your_spoonacular_key
```

#### `client/.env`

```env
VITE_SPOONACULAR_API_KEY=your_spoonacular_key
```

### 🧪 Development

```bash
npm run dev
```

> This starts both client and server locally.

---

## ⚙️ Deployment on Vercel

> This app is fully configured for **Vercel**.

### One-time Setup:

```bash
npm install -g vercel
vercel login
```

### Deploy

```bash
vercel --prod
```

Add these environment variables in the **Vercel Dashboard**:

* `MONGODB_URI`
* `JWT_SECRET`
* `SPOONACULAR_API_KEY`

---

## 📡 API Endpoints

### 🔐 Authentication

* `POST /api/auth/register` – Register new user
* `POST /api/auth/login` – Log in existing user

### 👤 User

* `GET /api/user/profile` – Fetch logged-in user's profile
* `PATCH /api/user/preferences` – Update preferences

### ❤️ Favorites

* `GET /api/favorites` – Fetch favorite recipes
* `POST /api/favorites` – Add to favorites
* `DELETE /api/favorites/:id` – Remove a recipe

---

## 🤝 Contributing

We welcome contributors! Please fork the repo, create a branch, and make a pull request.

---

## 📜 License

Licensed under the **MIT License**.

---

## 📬 Contact

Made with ❤️ by [Mukund Thakur](https://github.com/Mukund934) and team.
For issues or contributions, please use the **[GitHub Issues](https://github.com/Mukund934/Recipe-Finder/issues)** tab.

---

Let me know if you want this in a downloadable `.md` file or you’d like badges (e.g., deploy status, last commit, stars) added at the top!
