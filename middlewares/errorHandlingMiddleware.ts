/**
 * Updated by trungquandev.com's author on Sep 27, 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 * NOTE: (Muốn hiểu rõ hơn về code trong file này thì vui lòng xem video 55 trong bộ MERN Stack trên kênh Youtube của mình.)
 */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/enviroment';

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {

  // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack,
  };

  // console.error(responseError)

  /** #express : What is the difference between Development and Production?
   * Chia môi trường dev và production chuẩn ENV từ script
      Dựa vào biến để xử lý nhiều logic khác nhau.
      Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi. (Muốn hiểu rõ hơn hãy xem video 55 trong bộ MERN Stack trên kênh Youtube: https://www.youtube.com/@trungquandev)
   */
  // 
  
  console.log("env.BUILD_MODE",env.BUILD_MODE);
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
  // ...
  // console.error(responseError)

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError);
};

