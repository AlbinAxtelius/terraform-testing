# terraform testing

A repo where I'm testing terraform to setup aws resources with typescript.

## Lambdas

All `.ts` files in `src/functions` will be handled as lambdas as should therefore be built to follow the spec. The name of the file corresponds to the name of the lambda. The lambda will be built to `dist/functions/<name>.mjs`.
