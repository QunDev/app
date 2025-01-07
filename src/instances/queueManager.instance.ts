// queueManager.instance.ts
import { QueueManager } from '~/utils/queueManager.ts'

// concurrency = 20 cho phép xử lý 20 tác vụ song song
export const queueManager = new QueueManager(20)
