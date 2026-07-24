module.exports = async (req, res) => {

    const TARGET = "https://aaaapi-b003f5542068.herokuapp.com";

    try {

        const url = TARGET + req.url.replace(/^\/api/, "");

        const headers = { ...req.headers };

        delete headers.host;

        let body;

        if (req.method !== "GET" && req.method !== "HEAD") {

            body = JSON.stringify(req.body);

        }

        const response = await fetch(url, {

            method: req.method,

            headers,

            body,

            redirect: "follow"

        });

        const text = await response.text();

        res.status(response.status);

        response.headers.forEach((value, key) => {

            res.setHeader(key, value);

        });

        res.send(text);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
