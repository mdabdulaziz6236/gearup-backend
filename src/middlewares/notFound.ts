import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "API Endpoint Not Found",
        errorDetails: null
    });
};

export default notFound;