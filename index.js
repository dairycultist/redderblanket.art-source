const fs = require("fs");

if (process.argv.includes("--insecure")) {

	console.log("\nOpening on HTTP (--insecure)");

	require("node:http").createServer(onRequest).listen(8888, "0.0.0.0", () => { console.log(`Starting @ 127.0.0.1:8888`); });
	
} else {

	console.log("\nOpening on HTTPS");

	require("node:https").createServer({
		key: fs.readFileSync("../private.key.pem"),  // path to ssl PRIVATE key from Porkbun
		cert: fs.readFileSync("../domain.cert.pem"), // path to ssl certificate from Porkbun
	}, onRequest).listen(443, "0.0.0.0", () => { console.log(`Starting @ https://redderblanket.art/`); });
}

function onRequest(req, res) {

	console.log("\x1b[90m" + req.method + " " + req.url + "\x1b[0m");

	if (req.method == "GET" || req.method == "HEAD") {

		let filepath = req.url.split("?", 2)[0];

		if (req.url == "/")
			filepath = "/index.php";

		if (filepath.split(".").length == 2) { // no /img/../sensitive_file on us!

			try {

				let file;

				if (filepath.split(".")[1] == "php") {

					file = fs.readFileSync("./home" + filepath, "utf-8");
					res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

				} else if (filepath.split(".")[1] == "png") {

					file = fs.readFileSync("./home" + filepath);
					res.writeHead(200, { "Content-Type": "image/png" });

				} else {

					throw new Error("Unrecognized file type.");
				}

				res.end(file);

			} catch (e) {
				
				res.writeHead(404, { "Content-Type": "text/plain" });
				res.end("404 " + req.url + " Not Found; " + e);
			}

		} else {
			
			res.writeHead(403, { "Content-Type": "text/plain" });
			res.end("403 " + req.url + " Is Not Allowed!");
		}

	} else {

		res.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("501 Not Implemented");
	}
}

function getArticles() {

	const articles = {
		games: {},
		worlds: {}
	};

	for (const file of fs.readdirSync("./games")) {

		const parts = fs.readFileSync("./games/" + file, "utf-8").split("<!-- article body below -->");

		parts[0] = JSON.parse(parts[0]);

		parts[0].articleBody = parts[1];

		articles.games[file.split(".")[0]] = parts[0];
	}

	for (const file of fs.readdirSync("./worlds")) {

		const parts = fs.readFileSync("./worlds/" + file, "utf-8").split("<!-- article body below -->");

		parts[0] = JSON.parse(parts[0]);

		parts[0].articleBody = parts[1];

		articles.worlds[file.split(".")[0]] = parts[0];
	}

	return articles;
}