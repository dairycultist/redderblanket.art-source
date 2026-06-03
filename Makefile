.PHONY: test run update

test:
	node index.js --insecure

run:
	nohup sudo node index.js &

update:
	git fetch origin main
	git reset --hard FETCH_HEAD
