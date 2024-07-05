steps:
1. type `test` in a clean editor
2. undo
3. type `new`, press enter, type `stuff`
4. select all, then type `something`
5. refresh

If changing any node_modules directly:
`rm -rf .vite && rm -rf ./node_modules/.vite && yarn dev`