const TARGET = "https://aaaapi-b003f5542068.herokuapp.com";

module.exports = async (req, res) => {
  try {
    // Health check
    if (req.url === "/health") {
      return res.status(200).json({
        success: true,
        service: "SILA PROXY",
        target: TARGET,
        status: "online",
        time: new Date().toISOString()
      });
    }

    // Welcome page
    if (req.url === "/" || req.url === "") {
      return res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>SILA API</title>
<style>
body{
margin:0;
background:#0b1220;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
font-family:Arial,sans-serif;
color:white;
flex-direction:column;
}
h1{
color:#00d4ff;
}
p{
opacity:.8;
}
</style>
</head>
<body>
<h1>🚀 SILA API PROXY</h1>
<p>Powered by Vercel</p>
</body>
</html>
      `);
    }

    const url = new URL(req.url, TARGET);

    const headers = { ...req.headers };
    delete headers.host;

    let body;

    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];

      await new Promise((resolve, reject) => {
        req.on("data", chunk => chunks.push(chunk));
        req.on("end", resolve);
        req.on("error", reject);
      });

      if (chunks.length) {
        body = Buffer.concat(chunks);
      }
    }

    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
      redirect: "follow"
    });

    res.status(response.status);

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        res.setHeader(key, value);
      }
    });

    const arrayBuffer = await response.arrayBuffer();

    res.end(Buffer.from(arrayBuffer));

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Proxy Error",
      error: err.message
    });

  }
};
