ui/install:
	pnpm add ${1} --filter=ui --save-dev

ui/dev:
	make ui cmd="run dev"

ui:
	pnpm turbo ${cmd} --filter=ui