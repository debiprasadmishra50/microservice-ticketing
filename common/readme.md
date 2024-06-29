# Publishing the package to npm

1. git must be initialized, remote origin is not required
2. Run `npm init -y`
3. Change the name in `package.json` to <@USERNAME/PACKAGE_NAME>: example @debirapid-ticket/common
4. Commands to execute

```
> npm login
> npm publish --access public
```

After setup the package.json file

```json
{
  "name": "@debirapid-ticket/common",
  "version": "1.0.6",
  "description": "",
  "main": "./build/common/src/index.js",
  "types": "./build/common/src/index.d.ts",
  "files": ["./build/**/*"],
  "scripts": {
    "clean": "del ./build/*",
    "build": "npm run clean && tsc",
    "pub": "git add . && git commit -m \"Updates\" && npm version patch && npm run build && npm publish"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "del-cli": "^5.1.0",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "@types/cookie-session": "^2.0.48",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "cookie-session": "^2.0.0",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2"
  }
}
```
