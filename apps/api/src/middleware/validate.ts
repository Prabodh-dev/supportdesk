import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const err: any = new Error("ValidationError");
      err.statusCode = 400;
      err.details = result.error.flatten();
      return next(err);
    }
    next();
  };
