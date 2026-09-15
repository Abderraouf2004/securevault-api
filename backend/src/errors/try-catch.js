export const tryCatch = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Error in TryCatchBlock: ${message}`);
            console.error(`Error in TryCatchBlock  ${JSON.stringify(error)}`);
            next(error);
        }
    };
};
