export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        message = `Resource not found with id ${err.value}`;
        statusCode = 404;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map(val => val.message).join(", ");
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};
