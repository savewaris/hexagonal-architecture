import { FacebookAdapter } from '../social/FacebookAdapter.js';
import { PostContentOptions, PostResult } from '../social/SocialPlatformPort.js';
import { JobQueue } from '../queue/JobQueue.js';
import { Logger } from '../logging/Logger.js';

/**
 * Plug-and-Play Domain Preset: Facebook & Social Media Page Automation Foundation.
 * Pre-wires Facebook Graph API posting, scheduled queues, rate limiting, and analytics tracking.
 */
export class SocialAutomationPreset {
  public readonly facebookAdapter: FacebookAdapter;
  public readonly postingQueue: JobQueue<PostContentOptions>;

  constructor(fbPageAccessToken: string, defaultPageId?: string) {
    this.facebookAdapter = new FacebookAdapter({ pageAccessToken: fbPageAccessToken, defaultPageId });

    // Worker queue processing 1 post at a time to prevent rate limits
    this.postingQueue = new JobQueue<PostContentOptions>(1, async job => {
      Logger.info(`[SOCIAL AUTOMATION PRESET] -> Publishing queued post to Facebook page "${job.data.pageId}"...`);
      await this.facebookAdapter.publishPost(job.data);
    });
  }

  public async publishNow(pageId: string, message: string, linkUrl?: string): Promise<PostResult> {
    return this.facebookAdapter.publishPost({ pageId, message, linkUrl });
  }

  public queueAutomatedPost(pageId: string, message: string, linkUrl?: string): string {
    return this.postingQueue.enqueue({ pageId, message, linkUrl });
  }

  public async getPostAnalytics(postId: string) {
    return this.facebookAdapter.getEngagementStats(postId);
  }
}
