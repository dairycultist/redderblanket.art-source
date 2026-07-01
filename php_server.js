const fs = require("fs");

if (process.argv.includes("--insecure")) {

	console.log("\nOpening on HTTP (--insecure)");

	require("node:http").createServer(on_request).listen(8888, "0.0.0.0", () => { console.log(`Starting @ 127.0.0.1:8888`); });
	
} else {

	console.log("\nOpening on HTTPS");

	require("node:https").createServer({
		key: fs.readFileSync("../private.key.pem"),  // path to ssl PRIVATE key from Porkbun
		cert: fs.readFileSync("../domain.cert.pem"), // path to ssl certificate from Porkbun
	}, on_request).listen(443, "0.0.0.0", () => { console.log(`Starting @ https://redderblanket.art/`); });
}

function on_request(req, res) {

	console.log("\x1b[90m" + req.method + " " + req.url + "\x1b[0m");

	try {
	
		if (!req.method == "GET" && !req.method == "HEAD")
			throw new Error("We only do GET and HEAD requests here");

		let filepath = req.url.split("?", 2)[0];
		let query    = req.url.split("?", 2)[1];

		if (req.url == "/")
			filepath = "/index.php";

		if (filepath.split(".").length != 2) // no /img/../sensitive_file on us!
			throw new Error(filepath + " is not allowed!");

		switch (filepath.split(".")[1]) {

			case "php":
				res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
				res.end(get_php(filepath, query));
				break;

			case "png":
				res.writeHead(200, { "Content-Type": "image/png" });
				res.end(fs.readFileSync("./home" + filepath));
				break;

			case "jpeg":
			case "jpg":
				res.writeHead(200, { "Content-Type": "image/jpeg" });
				res.end(fs.readFileSync("./home" + filepath));
				break;

			case "gif":
				res.writeHead(200, { "Content-Type": "image/gif" });
				res.end(fs.readFileSync("./home" + filepath));
				break;

			default:
				throw new Error("Unrecognized file type.");
		}

	} catch (e) {

		res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
		res.end(e.message);
	}
}

function get_php(filepath, query) {

	let file = fs.readFileSync("./home" + filepath, "utf-8");

	let search_filter = query ? query.split("search=")[1] : "";
	let count = 0;

	file = file.replace(/<\?php\s([^?]*)\?>/g, (all, data) => {

		data = data.trim();

		let construct = "";

		for (const filename of fs.readdirSync("./home/art/")) {

			// filter out those not included in the search
			if (!filename.includes(search_filter))
				continue;
			
			count++;
			construct += data
				.replaceAll("[URL]", "/art/" + filename)
				.replaceAll("[FILENAME]", filename.split(".", 1)[0]);
				// [FILESIZE]?
		}

		return construct;
	});

	file = file.replace("[COUNT]", count);
	file = file.replace("[SEARCH]", search_filter);

	return file;
}