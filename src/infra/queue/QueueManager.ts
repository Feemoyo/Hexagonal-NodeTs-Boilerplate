import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '@config/env';

export interface QueueOptions {
  name: string;
  concurrency?: number;
}

export class QueueManager {
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();
  private connection = new IORedis(config.REDIS_URL);

  async createQueue(name: string): Promise<Queue> {
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }

    const queue = new Queue(name, { connection: this.connection });

    this.queues.set(name, queue);
    console.log(`[BullMQ] Queue "${name}" created`);

    return queue;
  }

  async addJob(queueName: string, data: any, options?: any) {
    const queue = await this.createQueue(queueName);
    return queue.add(queueName, data, options);
  }

  async subscribe(
    queueName: string,
    handler: (data: any) => Promise<void>,
    options?: { concurrency?: number }
  ) {
    const worker = new Worker(queueName, handler, {
      connection: this.connection,
      concurrency: options?.concurrency ?? 1,
    });

    worker.on('completed', (job) => {
      console.log(`[BullMQ] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[BullMQ] Job ${job?.id} failed:`, err.message);
    });

    this.workers.set(queueName, worker);
    console.log(`[BullMQ] Worker subscribed to "${queueName}"`);
  }

  async closeAll() {
    for (const [name, queue] of this.queues) {
      await queue.close();
      console.log(`[BullMQ] Queue "${name}" closed`);
    }

    for (const [name, worker] of this.workers) {
      await worker.close();
      console.log(`[BullMQ] Worker "${name}" closed`);
    }

    await this.connection.quit();
  }
}

export const queueManager = new QueueManager();
