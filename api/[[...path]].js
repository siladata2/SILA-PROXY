const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    secure: true
});

// ====== HEROKU TARGET ======
const TARGET = "https://aaaapi-b003f5542068.herokuapp.com";
// ===========================

module.exports = async (req, res) => {

    req.url = req.url.replace(/^\/api/, "");

    return new Promise((resolve, reject) => {

        proxy.web(req, res, {
            target: TARGET
        });

        proxy.once("proxyRes", () => {
            resolve();
        });

        proxy.once("error", (err) => {

            console.error(err);

            if (!res.headersSent) {

                res.statusCode = 502;

                res.setHeader("Content-Type", "application/json");

                res.end(JSON.stringify({
                    success: false,
                    message: "Proxy Error",
                    error: err.message
                }));
            }

            reject(err);

        });

    });

};
