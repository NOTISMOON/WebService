import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { MulterError } from "multer";

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // 打印 multer 错误（关键！能看到具体拦截原因）
    console.error('Multer 拦截错误：', exception.code, exception.message);
    // 返回错误响应
    response.status(400).json({
      code: 400,
      message: `文件上传失败：${exception.message}`,
      errorCode: exception.code,
    });
  }
}