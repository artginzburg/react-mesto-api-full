update:
	git submodule update --remote --merge

deploy:
	pm2 restart app && cd frontend && npm i && npm run build