import { Response } from 'express';

// API 응답을 위한 표준 인터페이스
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code?: string;
    details?: any;
  } | null;
}

/**
 * 성공 응답을 보냅니다.
 * @param res Express Response 객체
 * @param data 보낼 데이터
 * @param message 성공 메시지
 * @param statusCode HTTP 상태 코드 (기본값: 200)
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    error: null,
  };
  res.status(statusCode).json(response);
};

/**
 * 실패 응답을 보냅니다.
 * @param res Express Response 객체
 * @param message 실패 메시지
 * @param statusCode HTTP 상태 코드 (기본값: 500)
 * @param errorCode 에러 코드 문자열
 * @param errorDetails 에러 상세 정보
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errorCode?: string,
  errorDetails?: any
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    error: {
      code: errorCode,
      // 운영 환경(production)이 아닐 때만 상세 에러 정보를 포함합니다.
      details: process.env.NODE_ENV !== 'production' ? errorDetails : undefined,
    },
  };
  res.status(statusCode).json(response);
};
