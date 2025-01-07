// queueManager.ts
import { EventEmitter } from 'events'

// Trạng thái Operation
enum OperationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  FAILED = 'FAILED'
}

// Cấu trúc lưu 1 Operation trong hàng đợi
interface Operation<TPayload, TResult> {
  id: string
  name: string
  payload: TPayload
  status: OperationStatus
  // Các hàm để hoàn thành promise
  resolve: (value: TResult) => void
  reject: (reason?: any) => void
}

export class QueueManager extends EventEmitter {
  private concurrency: number
  private running: number
  private queue: Operation<any, any>[]

  constructor(concurrency = 1) {
    super()
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  /**
   * Hàm enqueue trả về một Promise.
   * - TPayload: kiểu payload đầu vào
   * - TResult: kiểu kết quả trả về
   */
  public enqueue<TPayload, TResult>(
    name: string,
    payload: TPayload,
    handler: (payload: TPayload) => Promise<TResult>
  ): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      const operation: Operation<TPayload, TResult> = {
        id: this.generateId(),
        name,
        payload,
        status: OperationStatus.PENDING,
        resolve,
        reject
      }
      // Đưa Operation vào queue
      this.queue.push(operation)

      // Gọi processQueue để xử lý nếu có slot
      this.processQueue(handler)
    })
  }

  /**
   * Tiến hành xử lý các Operation trong queue theo concurrency
   */
  private processQueue(handler: (payload: any) => Promise<any>) {
    // Nếu đang chạy >= concurrency thì không làm gì
    if (this.running >= this.concurrency) return

    // Tìm Operation PENDING đầu tiên
    const nextOpIndex = this.queue.findIndex((op) => op.status === OperationStatus.PENDING)
    if (nextOpIndex === -1) return // Không còn Operation nào để xử lý

    const nextOp = this.queue[nextOpIndex]
    nextOp.status = OperationStatus.IN_PROGRESS
    this.running++

    // Xoá Operation này khỏi hàng đợi "chờ"
    this.queue.splice(nextOpIndex, 1)

    // Thực thi logic
    handler(nextOp.payload)
      .then((result) => {
        nextOp.status = OperationStatus.DONE
        nextOp.resolve(result)
      })
      .catch((err) => {
        nextOp.status = OperationStatus.FAILED
        nextOp.reject(err)
      })
      .finally(() => {
        this.running--
        this.processQueue(handler) // Tiếp tục xử lý operation tiếp theo
      })
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8)
  }
}
