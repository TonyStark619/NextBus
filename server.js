const express = require("express");
const path = require("path");
const app = express();

// Serve frontend from client folder
app.use(express.static(path.join(__dirname, "client")));

// Optional: catch-all for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Server port
const PORT = process.env.PORT || 619;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
