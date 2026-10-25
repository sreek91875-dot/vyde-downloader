
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body || {};

    if (!url || !/^https?:\/\//i.test(url)) {
      return res.status(400).json({
        error: "Masukkan tautan video yang valid."
      });
    }

    const apiUrl =
      "https://www.tikwm.com/api/?url=" +
      encodeURIComponent(url) +
      "&hd=1";

    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.code !== 0 || !result.data) {
      return res.status(502).json({
        error: "Video gagal diproses. Coba tautan lain."
      });
    }

    const videoUrl = result.data.hdplay || result.data.play;

    if (!videoUrl) {
      return res.status(502).json({
        error: "Tautan unduhan tidak tersedia."
      });
    }

    res.json({ downloadUrl: videoUrl });
  } catch (error) {
    res.status(500).json({
      error: "Layanan sedang bermasalah. Coba lagi nanti."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`VYDE berjalan di port ${PORT}`);
});
