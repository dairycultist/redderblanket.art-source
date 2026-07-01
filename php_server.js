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
		let query    = new URLSearchParams(req.url.split("?", 2)[1]);

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
	let total = 0;

	const search_filter = query.get("search") || "";
	const page_number = Number(query.get("page") || 1);

	file = file.replace(/<\?php\s([^?]*)\?>/g, (all, data) => {

		data = data.trim();

		let construct = "";
		let count = 0;

		for (const filename of fs.readdirSync("./home/art/")) {

			// filter out those not included in the search from total
			if (!filename.includes(search_filter))
				continue;

			total++;

			// skip later pages
			if (count == 10)
				continue;

			// skip previous pages
			if (total < (page_number - 1) * 10 + 1)
				continue;
			
			count++;
			construct += data
				.replaceAll("[URL]", "/art/" + filename)
				.replaceAll("[FILENAME]", filename.split(".", 1)[0]);
				// [FILESIZE]?
		}

		return construct;
	});

	const page_count = Math.ceil(total / 10);

	file = file.replace("[TOTAL]", total);
	file = file.replace("[SEARCH]", search_filter);
	file = file.replace("[PREV_PAGE_HREF]", page_number == 1          ? "" : `href="?search=${ search_filter }&page=${ page_number - 1 }"`);
	file = file.replace("[NEXT_PAGE_HREF]", page_number == page_count ? "" : `href="?search=${ search_filter }&page=${ page_number + 1 }"`);
	file = file.replace("[PAGE_NUMBER]", page_number);
	file = file.replace("[PAGE_COUNT]", page_count);

	return file;
}