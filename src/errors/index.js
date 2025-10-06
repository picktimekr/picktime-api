class MethodNotAllowed extends Error {
  status = 405;
  constructor(message = '사용할 수 없는 메소드입니다.') {
    super(message);
    this.name = 'Method Not Allowed';
  }
}

class NotFoundError extends Error {
  status = 404;
  constructor(message = '페이지를 찾을 수 없습니다.') {
    super(message);
    this.name = 'Not Found';
  }
}

module.exports = {
  MethodNotAllowed,
  NotFoundError,
};
