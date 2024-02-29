module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        // Add your desired rules here, some suggestions below:

        // Potential errors:
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Warn about unused variables (ignore leading underscore)
        "@typescript-eslint/no-explicit-any": ["error"], // Disallow the 'any' type
        "@typescript-eslint/no-inferrable-types": ["error", { "ignoreParameters": true }], // Warn about type annotations already inferred by TypeScript compiler (ignore function parameters)
        "no-undef": ["error"], // Warn about undefined variables

        // Best practices:
        "camelcase": ["error", { "properties": "never" }], // Enforce camelCase naming convention
        "curly": ["error", "multi-line"], // Require curly braces for control flow statements
        "no-console": "warn", // Warn about using console (consider alternative logging methods in production)
        "no-empty": ["error", "always"], // Disallow empty blocks
        "no-extra-semi": ["error"], // Disallow unnecessary semicolons
        "quotes": ["error", "double"], // Enforce double quotes for strings
        "semi": ["error", "always"], // Enforce semicolons

        // Readability:
        "max-len": ["error", { "code": 120 }], // Limit code line length
        "no-multiple-empty-lines": ["error", { "max": 1 }], // Allow maximum of one empty line
        "no-trailing-spaces": ["error"], // Disallow trailing spaces
        "object-curly-spacing": ["error", "always"], // Enforce consistent spacing around object literals

        // Imports:
        "import/no-extraneous-dependencies": ["error"], // Warn about unused imported modules
        "import/order": ["error", { "groups": ["builtin", "external", "internal"], "newlines-between": "always" }], // Organize imports

        // Additional suggestions:
        "@typescript-eslint/ban-ts-ignore": "error", // Disallow `@ts-ignore` comments
        "@typescript-eslint/explicit-module-boundary-types": ["error"], // Require explicit return and argument types for modules
        "@typescript-eslint/no-floating-promises": ["error"], // Warn about unhandled promises
        "@typescript-eslint/no-misused-promises": ["error"], // Warn about misuse of promises (e.g., not waiting for them to resolve)
    }
}
