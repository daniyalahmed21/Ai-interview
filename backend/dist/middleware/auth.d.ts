import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId?: string;
}
declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=auth.d.ts.map