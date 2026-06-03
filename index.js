const fs = require("fs");

const articleData = {
	mods: [
		{
			headerImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f7195997-7848-47de-bc04-bb31e278204f/dlqihiv-f469693c-1808-427f-a2fb-5b07ec7fd585.png/v1/fill/w_857,h_933,q_70,strp/alien_oc_again_by_redderblanket_dlqihiv-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTgwIiwicGF0aCI6Ii9mL2Y3MTk1OTk3LTc4NDgtNDdkZS1iYzA0LWJiMzFlMjc4MjA0Zi9kbHFpaGl2LWY0Njk2OTNjLTE4MDgtNDI3Zi1hMmZiLTViMDdlYzdmZDU4NS5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Y9AVEhMC87dzSdUCX5tnL5HzaIv72ZQoz9aSFZAzptE",
			title: "Fat balatro cards",
			description: "balatro balatrez"
		}
	],
	projects: [
		{
			headerImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f7195997-7848-47de-bc04-bb31e278204f/dlqihiv-f469693c-1808-427f-a2fb-5b07ec7fd585.png/v1/fill/w_857,h_933,q_70,strp/alien_oc_again_by_redderblanket_dlqihiv-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTgwIiwicGF0aCI6Ii9mL2Y3MTk1OTk3LTc4NDgtNDdkZS1iYzA0LWJiMzFlMjc4MjA0Zi9kbHFpaGl2LWY0Njk2OTNjLTE4MDgtNDI3Zi1hMmZiLTViMDdlYzdmZDU4NS5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Y9AVEhMC87dzSdUCX5tnL5HzaIv72ZQoz9aSFZAzptE",
			title: "Sci-fi world",
			description: "my generic gooner sci-fi fantasy"
		}
	]
};

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

			const articleCardTemplate = fs.readFileSync("article_card.htm", "utf-8");

			let mods = "";
			let projects = "";

			for (const x of articleData.mods)
				mods += articleCardTemplate.replace("insert_header.img", x.headerImage).replace("<!-- insert title -->", x.title).replace("<!-- insert description -->", x.description).replace("insert-download-is-flex-or-none", "flex");

			for (let i = 0; i < (3 - articleData.mods.length % 3) % 3; i++)
				mods += "<div class='fake-article'></div>";

			for (const x of articleData.projects)
				projects += articleCardTemplate.replace("insert_header.img", x.headerImage).replace("<!-- insert title -->", x.title).replace("<!-- insert description -->", x.description).replace("insert-download-is-flex-or-none", "none");

			for (let i = 0; i < (3 - articleData.projects.length % 3) % 3; i++)
				projects += "<div class='fake-article'></div>";

			let page = fs.readFileSync("home.html", "utf-8");
			page = page.replace("<!-- insert mods -->", mods);
			page = page.replace("<!-- insert art projects -->", projects);

			res.end(page);
		
		} else {
			
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.end(req.url + " Not Found");
		}

	} else {

		res.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("501 Not Implemented");
	}
}