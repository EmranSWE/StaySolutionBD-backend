"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extracts relevant information from a SyntaxError message.
 * @param errorMessage The message string from the SyntaxError.
 * @returns An object containing the problematic token and its position.
 */
const extractSyntaxErrorDetails = (errorMessage) => {
    const match = errorMessage.match(/Unexpected token (.*?) in JSON at position (\d+)/);
    if (match && match.length >= 3) {
        const [, token, position] = match; // Destructure for clarity.
        return { token, position: Number(position) };
    }
    return null;
};
/**
 * Generates a user-friendly error message based on the syntax error details.
 * @param details An object containing the problematic token and its position.
 * @returns A formatted error message string.
 */
const generateDetailedErrorMessage = (details) => {
    return `There's a syntax error in the provided JSON. Unexpected token ${details.token} found at position ${details.position}.`;
};
/**
 * Handles SyntaxError exceptions to produce a user-friendly error response.
 * @param error The SyntaxError exception.
 * @returns A user-friendly error response.
 */
const handleSyntaxError = (error) => {
    const errorDetails = extractSyntaxErrorDetails(error.message);
    const detailedMessage = errorDetails
        ? generateDetailedErrorMessage(errorDetails)
        : "There's a syntax error in the provided JSON.";
    const errorPath = errorDetails ? errorDetails.token : 'Unknown';
    return {
        statusCode: 400,
        message: 'Syntax Validation Error',
        errorMessages: [
            {
                path: errorPath,
                message: detailedMessage,
            },
        ],
    };
};
exports.default = handleSyntaxError;
//Export handleSyntaxError function
