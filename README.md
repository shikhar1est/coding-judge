# 🧑‍💻 Coding Judge Backend

A full-fledged backend system for an online coding judge platform — built with Node.js, Express, MongoDB, and Docker. It supports multi-language code execution (C++, Python, JS), problem management, user authentication, automated evaluation, and plagiarism detection.

---

## 🚀 Features

- 🔐 **JWT Authentication** with user/admin roles
- 📄 **Problem Management** with test cases (admin only)
- 📤 **Code Submission** and result evaluation
- 🧪 **Unit Tests** for major APIs
- 📊 **Leaderboard** to showcase top performers
- 🐳 **Dockerized Execution** for code safety and isolation
- 🚫 **Plagiarism Detection** via token-based similarity
- 📈 **Rate Limiting** to prevent abuse

---

## 🛠️ Technologies

- Node.js + Express
- MongoDB + Mongoose
- JWT, bcryptjs
- Docker (with separate images per language)
- Jest + Supertest (unit testing)
- Esprima + string-similarity (for plagiarism)
- Swagger (API docs)

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/coding-judge-backend.git
cd coding-judge-backend/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/coding_judge
JWT_SECRET=supersecret123
```

### 4. Start Dev Server

```bash
npm run dev
```

---

## 🐳 Docker Code Runners

Supported Languages:
- `cpp`
- `python`
- `javascript`

Dockerfiles are located at the root level:
```
.
├── Dockerfile-cpp
├── Dockerfile-python
├── Dockerfile-js
```

Each submission spins up a temporary container, runs user code in isolation, and returns the output.

---

## 🧪 Running Unit Tests

```bash
npm test
```

Covers:
- Auth (register/login)
- Problem CRUD
- Code submission and fetch APIs

---

## 🔍 Plagiarism Detection

- **Tokenization** via `esprima`
- **Similarity** via `string-similarity`
- Flags submissions with >80% token match

---

## 📊 Leaderboard API

Ranks users based on:
- Number of problems solved
- Accuracy (accepted submissions / total)

```http
GET /api/leaderboard
```

---

## 🔐 Rate Limiting

- Limits excessive submission requests
- Implemented using middleware per IP/user

---

## 📚 API Docs (Swagger)

Available at:

```
http://localhost:5000/api-docs
```

---

## 🧼 Folder Structure

```
/server
├── controllers/
├── routes/
├── models/
├── middleware/
├── utils/
├── tests/
├── temp/       ← code + input temp files
├── Dockerfile-* ← Docker sandboxes
├── .env
```

---

## 🤝 Contributions

PRs welcome for:
- Frontend integration
- Improved judging logic
- Advanced plagiarism

---

## 📜 License

MIT

---

## 👨‍🚀 Author

Made with ❤️ by **Shikhar Rai**