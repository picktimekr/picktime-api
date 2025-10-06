
// src/config/config.ts

// TODO: 실제 운영에서는 .env 파일 등을 사용하여 관리하는 것이 안전합니다.
// 이 값들을 실제 사용자의 MySQL 데이터베이스 정보로 변경해주세요.
export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'a1234', // 본인의 MySQL 비밀번호
  database: 'picktime', // 사용할 데이터베이스 이름
  dialect: 'mysql' as 'mysql',
};

export const serverConfig = {
  port: 3003,
};
