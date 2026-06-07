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

		if (req.url == "/") {
			
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

			const articleData = getArticles();
			const articleCardTemplate = fs.readFileSync("article_card.htm", "utf-8");

			let games = "";
			let worlds = "";

			for (const id in articleData.games)
				games += articleCardTemplate.replace("insert_header.img", articleData.games[id].headerImage).replace("<!-- insert title -->", articleData.games[id].title).replace("<!-- insert description -->", articleData.games[id].description).replace("insert-download-is-flex-or-none", "flex").replace("insert/page/url", "/game/" + id).replace("insert/download/url", articleData.games[id].downloadUrl);

			for (let i = 0; i < (3 - Object.keys(articleData.games).length % 3) % 3; i++)
				games += "<div class='fake-article'></div>";

			for (const id in articleData.worlds)
				worlds += articleCardTemplate.replace("insert_header.img", articleData.worlds[id].headerImage).replace("<!-- insert title -->", articleData.worlds[id].title).replace("<!-- insert description -->", articleData.worlds[id].description).replace("insert-download-is-flex-or-none", "none").replace("insert/page/url", "/world/" + id);

			for (let i = 0; i < (3 - Object.keys(articleData.worlds).length % 3) % 3; i++)
				worlds += "<div class='fake-article'></div>";

			let page = fs.readFileSync("home.html", "utf-8");
			page = page.replace("<!-- insert games -->", games);
			page = page.replace("<!-- insert worlds -->", worlds);

			res.end(page);

		} else if (req.url.startsWith("/game/")) {

			const i = req.url.substring("/game/".length);
			const articleData = getArticles();

			if (articleData.games[i] == undefined)
				return err404(req, res);

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(
				fs.readFileSync("article.html", "utf-8")
				.replace("insert_header.img", articleData.games[i].headerImage)
				.replaceAll("<!-- insert title -->", articleData.games[i].title)
				.replace("<!-- insert article body -->", articleData.games[i].articleBody)
				.replace("insert-download-is-flex-or-none", "flex")
				.replace("insert/download/url", articleData.games[i].downloadUrl)
			);

		} else if (req.url.startsWith("/world/")) {

			const i = req.url.substring("/world/".length);
			const articleData = getArticles();

			if (articleData.worlds[i] == undefined)
				return err404(req, res);

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(
				fs.readFileSync("article.html", "utf-8")
				.replace("insert_header.img", articleData.worlds[i].headerImage)
				.replaceAll("<!-- insert title -->", articleData.worlds[i].title)
				.replace("<!-- insert article body -->", articleData.worlds[i].articleBody)
				.replace("insert-download-is-flex-or-none", "none")
			);
		
		} else if (req.url == "/favicon.png") {

			res.writeHead(200, { "Content-Type": "image/png" });
			res.end(fs.readFileSync("favicon.png"));
			
		} else {
			
			err404(req, res);
		}

	} else {

		res.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("501 Not Implemented");
	}
}

function err404(req, res) {

	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end(req.url + " Not Found");
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