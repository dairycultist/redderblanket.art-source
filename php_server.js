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

		if (req.url == "/")
			filepath = "/index.php";

		if (filepath.split(".").length != 2) // no /img/../sensitive_file on us!
			throw new Error(filepath + " is not allowed!");

		let file;

		if (filepath.split(".")[1] == "php") {

			file = process_php(fs.readFileSync("./home" + filepath, "utf-8"));
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

		} else if (filepath.split(".")[1] == "png") {

			file = fs.readFileSync("./home" + filepath);
			res.writeHead(200, { "Content-Type": "image/png" });

		} else {

			throw new Error("Unrecognized file type.");
		}

		res.end(file);

	} catch (e) {

		res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
		res.end(e.message);
	}
}

function process_php(text) {

	return text.replace(/<\?php\s([^?]*)\?>/g, (all, data) => {
		
		data = data.trim();

		let construct = "";

		for (const filename of fs.readdirSync("./home/art/")) {

			// TODO filter out those not included in the search
			// TODO count how many

			construct += data
				.replaceAll("[URL]", "/art/" + filename)
				.replaceAll("[FILENAME]", filename.split(".", 1)[0]);
				// [EXTENSION], [FILESIZE]...
		}

		return construct;
	}); 
}