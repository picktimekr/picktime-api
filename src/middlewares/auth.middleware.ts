import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * 인증 여부를 확인하는 미들웨어 (Placeholder).
 * TODO: 실제 프로덕션에서는 JWT, 세션 등 실제 인증 로직을 구현해야 합니다.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 현재는 모든 요청을 인증된 것으로 간주하는 플레이스홀더입니다.
  const userIsAuthenticated = true; 

  if (userIsAuthenticated) {
    // 사용자가 인증되었다면, 다음 미들웨어나 컨트롤러로 요청을 전달합니다.
    next();
  } else {
    // 인증되지 않았다면, 401 Unauthorized 에러를 보냅니다.
    sendError(res, 'Authentication required. Please log in.', 401, 'UNAUTHORIZED');
  }
};
