/**
 * A job scheduler that runs asynchronous tasks with limited concurrency
 * and optional delay between tasks.
 */
export const createJobScheduler = (
  maxConcurrentJobs = 1,
  delayBetweenJobsMs = 1000,
) => {
  let activeJobCount = 0;
  const pendingJobQueue: (() => void)[] = [];

  const startNextJob = () => {
    if (activeJobCount >= maxConcurrentJobs) return;

    const nextJob = pendingJobQueue.shift();
    if (nextJob) {
      nextJob();
    }
  };

  const addJob = <Result>(task: () => Promise<Result>): Promise<Result> => {
    return new Promise((resolve, reject) => {
      const runJob = async () => {
        activeJobCount++;

        try {
          const result = await task();

          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          activeJobCount--;

          // wait some time before starting the next job
          setTimeout(() => startNextJob(), delayBetweenJobsMs);
        }
      };

      pendingJobQueue.push(runJob);
      startNextJob();
    });
  };

  return { addJob };
};

const DEFAULT_MAX_JOBS = 1;
const DEFAULT_DELAY_MS = 2000;

export const defaultScheduler = createJobScheduler(
  DEFAULT_MAX_JOBS,
  DEFAULT_DELAY_MS,
);
