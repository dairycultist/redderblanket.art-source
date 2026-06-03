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

			const articleData = JSON.parse(fs.readFileSync("article_data.json", "utf-8"));
			const articleCardTemplate = fs.readFileSync("article_card.htm", "utf-8");

			let mods = "";
			let projects = "";

			for (const i in articleData.mods)
				mods += articleCardTemplate.replace("insert_header.img", articleData.mods[i].headerImage).replace("<!-- insert title -->", articleData.mods[i].title).replace("<!-- insert description -->", articleData.mods[i].description).replace("insert-download-is-flex-or-none", "flex").replace("insert/page/url", "/mods/" + i).replace("insert/download/url", articleData.mods[i].downloadUrl);

			for (let i = 0; i < (3 - articleData.mods.length % 3) % 3; i++)
				mods += "<div class='fake-article'></div>";

			for (const i in articleData.projects)
				projects += articleCardTemplate.replace("insert_header.img", articleData.projects[i].headerImage).replace("<!-- insert title -->", articleData.projects[i].title).replace("<!-- insert description -->", articleData.projects[i].description).replace("insert-download-is-flex-or-none", "none").replace("insert/page/url", "/projects/" + i);

			for (let i = 0; i < (3 - articleData.projects.length % 3) % 3; i++)
				projects += "<div class='fake-article'></div>";

			let page = fs.readFileSync("home.html", "utf-8");
			page = page.replace("<!-- insert mods -->", mods);
			page = page.replace("<!-- insert art projects -->", projects);

			res.end(page);

		} else if (req.url.startsWith("/mods/")) {

			const i = req.url.substring(6);
			const articleData = JSON.parse(fs.readFileSync("article_data.json", "utf-8"));

			if (articleData.mods[i] == undefined)
				return err404(req, res);

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(
				fs.readFileSync("article.html", "utf-8")
				.replace("insert_header.img", articleData.mods[i].headerImage)
				.replaceAll("<!-- insert title -->", articleData.mods[i].title)
				.replace("<!-- insert article body -->", articleData.mods[i].articleBody)
				.replace("insert-download-is-flex-or-none", "flex")
				.replace("insert/download/url", articleData.mods[i].downloadUrl)
			);

		} else if (req.url.startsWith("/projects/")) {

			const i = req.url.substring(10);
			const articleData = JSON.parse(fs.readFileSync("article_data.json", "utf-8"));

			if (articleData.projects[i] == undefined)
				return err404(req, res);

			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(
				fs.readFileSync("article.html", "utf-8")
				.replace("insert_header.img", articleData.projects[i].headerImage)
				.replaceAll("<!-- insert title -->", articleData.projects[i].title)
				.replace("<!-- insert article body -->", articleData.projects[i].articleBody)
				.replace("insert-download-is-flex-or-none", "none")
			);
		
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