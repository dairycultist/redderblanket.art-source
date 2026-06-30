.PHONY: test run update

test:
	node php_server.js --insecure

run:
	nohup sudo node php_server.js &

update:
	git fetch origin main
	git reset --hard FETCH_HEAD
