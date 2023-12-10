"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define an array of error patterns that will be checked against the error message.
// Each pattern contains a regex to match the error and a function to extract the error message.
const ERROR_PATTERNS = [
    {
        // Match errors about invalid argument values
        regex: /Invalid value for argument `(.*?)`. (Expected .*?\.)/,
        // Extract the whole matched string as the error message
        errorMessage: (match) => match[0],
    },
    {
        // Match errors about missing arguments
        regex: /Argument `(.*?)` is missing\./,
        // Extract the whole matched string as the error message
        errorMessage: (match) => match[0],
    },
    {
        // Match errors about providing invalid values
        regex: /Argument `(.*?)`: Invalid value provided\./,
        // Construct an error message using the matched argument name
        errorMessage: (match) => `Invalid or missing value for ${match[1]}`,
    },
    {
        // Match errors about unknown arguments and suggest the closest available option
        regex: /Unknown argument `(.*?)`. Did you mean `(.*?)`\?/,
        // Construct an error message using the matched unknown argument and the suggestion
        errorMessage: (match) => `Unknown argument ${match[1]}. Did you mean ${match[2]}?`,
    },
];
const handleValidationError = (error) => {
    let errorMessage = ''; // Default error message
    let errorPath = 'Unknown Field'; // Default error field or argument name
    const statusCode = 400; // The status code for validation errors is generally 400 (Bad Request)
    // Loop through each pattern and check if it matches the error message
    for (const pattern of ERROR_PATTERNS) {
        const match = error.message.match(pattern.regex);
        if (match) {
            // If a match is found, extract the field or argument name
            errorPath = match[1];
            // Extract or construct the error message using the provided function
            errorMessage = pattern.errorMessage(match);
            break; // Exit the loop once a match is found
        }
    }
    // Construct the error response
    return {
        statusCode,
        message: 'Validation Error',
        errorMessages: [
            {
                path: errorPath,
                message: errorMessage, // Extracted or constructed error message
            },
        ],
    };
};
exports.default = handleValidationError;
