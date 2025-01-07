import Queue from 'bull'
import { createWriteStream } from 'fs'
import { promisify } from 'util'
import { pipeline, Readable } from 'stream'

const pump = promisify(pipeline)

// Tạo hàng đợi xử lý file
// export const fileProcessingQueue = new Queue('file-processing');
//
// // Xử lý các công việc trong hàng đợi
// fileProcessingQueue.process(async (job) => {
//   console.log('Processing job:', job);
//   const { buffer, filepath } = job.data;
//   console.log(`Processing file: ${filepath}`);
//   console.log(`Buffer: ${buffer}`);
//
//   const bufferStream = new Readable();
//   bufferStream.push(buffer);
//   bufferStream.push(null);
//
//   // Ghi file vào hệ thống
//   await pump(bufferStream, createWriteStream(filepath));
// });

export const fileProcessing = async ({ buffer, filepath }: { buffer: any; filepath: string }) => {
  const bufferStream = new Readable()
  bufferStream.push(buffer)
  bufferStream.push(null)

  // Ghi file vào hệ thống
  await pump(bufferStream, createWriteStream(filepath))
}
