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

	if (req.method == "GET" || req.method == "HEAD") {

		let filepath = req.url.split("?", 2)[0];

		if (req.url == "/")
			filepath = "/index.php";

		if (filepath.split(".").length == 2) { // no /img/../sensitive_file on us!

			try {

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

function process_php(text) {

	return text.replaceAll(/<\?php\s([^?]*)\?>/g, (all, php) => {
		
		php = php.trim();

		const index = php.indexOf("\n");

		// the first line is the code, the rest is data to apply the code to (we're ignoring the code for now)
		const code = php.substring(0, index);
		const data = php.substring(index + 1);

		let construct = "";

		const filenames = fs.readdirSync("./home/art/");

		for (const filename of filenames) {

			construct += data.replace("[URL]", "/art/" + filename).replace("[FILENAME]", filename);
		}

		return construct;
	}); 
}