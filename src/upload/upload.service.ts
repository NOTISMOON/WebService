import { HttpException, Injectable } from '@nestjs/common';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
} from 'node:fs';
import { extname, join,  } from 'node:path';
import { calculateHashAsync } from 'src/utils';
// import { CreateUploadDto } from './dto/create-upload.dto';
@Injectable()
export class UploadService {
  create(Dto: Express.Multer.File) {
    return {
      code: 201,
      url:`/xya/${Dto.filename}`,
    };
  }
   async createVidoeChunk(file, body) {
      console.log('开始处理切片：', body.chunkIndex); // 检查是否进入函数
    const { fileHash, chunkIndex, chunkHash,filename } = body;
  const tempDir = join(process.cwd(), 'images/temp', fileHash); // 绝对路径
  // 当前切片的目标路径（和之前的存储路径一致）
  const targetChunkPath = join(tempDir, `${chunkIndex}${extname(filename)}`);
    try {
if (existsSync(targetChunkPath)) {
      // 可选：进一步验证已存在切片的哈希是否正确（防止之前传的切片损坏）
      const existingHash= await  calculateHashAsync(targetChunkPath)
      if (existingHash === chunkHash) {
        // 切片已存在且完整，直接返回成功，不重复存储
        unlinkSync(file.path); // 删除刚上传的重复切片文件
        return { code: 0, message: `切片 ${chunkIndex} 已存在，无需重复上传` };
      } else {
        // 已存在的切片损坏，删除后重新存储新上传的切片
        unlinkSync(targetChunkPath);
      }
    }
      // 1. 读取上传的切片文件，计算哈希（与前端算法一致：SHA-1）

     const calculatedHash=  await calculateHashAsync(file.path)
      // 2. 验证切片哈希是否匹配（防止传输损坏）
      if (calculatedHash !== chunkHash) {
        throw new Error('切片哈希不匹配');
      }
      return {
        code: 0,
        message: `切片 ${chunkIndex} 上传成功`,
      };
    } catch (error) {
      // 验证失败时，删除无效切片文件
      if (file.path) {
        unlinkSync(file.path);
      }
      throw new HttpException(
        `切片 ${chunkIndex} 上传失败：${error.message}`,
        400,
      );
    }
  }
  checkVideochunk(fileHash) {
    const filepath = join(process.cwd(),`images/temp/${fileHash}`);
    try {
      if (!existsSync(filepath)) {
        return { code: 0, data: { uploadedIndexes: [] } }; // 返回空列表
      }
      const chunkFiles = readdirSync(filepath);
      const uploadedIndexes = chunkFiles.map((filename) => {
        return parseInt(filename.split('.')[0], 10);
      });
      return {
        code: 0,
        data: { uploadedIndexes: uploadedIndexes.sort((a, b) => a - b) },
      };
    } catch (e) {
      return { code: 1, message: '查询已传切片失败', error: e.message };
    }
  }
  async mergeChunk(body) {
    const { fileHash, filename, totalChunks } = body;
 const tempDir = join(process.cwd(), 'images/temp', fileHash); // 绝对路径
  const targetPath = join(process.cwd(), 'images', filename); ; // 合并后的最终文件路径
    const chunkFiles = readdirSync(tempDir);
    // 验证切片数量是否正确（例如：前端说有10片，实际只传了9片则报错）
    if (chunkFiles.length !== totalChunks) {
      throw new Error(
        `切片不完整：预期 ${totalChunks} 片，实际 ${chunkFiles.length} 片`,
      );
    }
    const sortChunkfile = chunkFiles
      .map((fileName) => {
        return {
          index: parseInt(fileName.split('.')[0], 10),
          path: join(tempDir, fileName),
        };
      })
      .sort((a, b) => a.index - b.index)
      .map((item) => item.path);
    const writeStream = createWriteStream(targetPath);
    for (const chunkpath of sortChunkfile) {
      await new Promise<void>((resolve, reject) => {
        const readStream = createReadStream(chunkpath);

        readStream.pipe(writeStream, { end: false });

        readStream.on('end', resolve);

        readStream.on('error', reject);
      });
    }
    writeStream.end();
    sortChunkfile.forEach((i) => {
      unlinkSync(i);
    });
    rmdirSync(tempDir);
    return {
      code: 0,
      message: '文件合并成功',
      data: { url: `/xya/${filename}` }, // 前端可通过该 URL 访问文件
    };
  }
}
