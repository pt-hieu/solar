moon/install:
	pnpm add ${1} --filter=ui --save-dev

moon/dev:
	make moon cmd="run dev"

moon:
	pnpm turbo ${cmd} --filter=moon