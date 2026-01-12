import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js", "**/*.jsx"],
        plugins: {
            react
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error"
        }
    }
];
