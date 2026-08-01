import { SocialPlatformPort, PostContentOptions, PostResult, EngagementStats } from './SocialPlatformPort.js';

export interface FacebookAdapterConfig {
  pageAccessToken: string;
  defaultPageId?: string;
}

/**
 * Concrete Adapter implementing SocialPlatformPort for Facebook Graph API Page Automation.
 */
export class FacebookAdapter implements SocialPlatformPort {
  private readonly pageAccessToken: string;
  private readonly defaultPageId?: string;

  constructor(config: FacebookAdapterConfig) {
    if (!config.pageAccessToken || config.pageAccessToken.trim().length === 0) {
      throw new Error('FacebookAdapter requires a valid pageAccessToken.');
    }
    this.pageAccessToken = config.pageAccessToken;
    this.defaultPageId = config.defaultPageId;
  }

  public async publishPost(options: PostContentOptions): Promise<PostResult> {
    const pageId = options.pageId || this.defaultPageId || 'default_fb_page';
    const postId = `${pageId}_post_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

    // Simulate Facebook Graph API POST /{page-id}/feed
    return {
      postId,
      pageId,
      published: true,
      permalinkUrl: `https://facebook.com/${pageId}/posts/${postId}`,
    };
  }

  public async schedulePost(options: PostContentOptions, publishAt: Date): Promise<PostResult> {
    const pageId = options.pageId || this.defaultPageId || 'default_fb_page';
    const postId = `${pageId}_sched_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

    // Simulate Facebook Graph API scheduled publish_time
    return {
      postId,
      pageId,
      published: false,
      scheduledTime: publishAt,
      permalinkUrl: `https://facebook.com/${pageId}/posts/${postId}`,
    };
  }

  public async getEngagementStats(postId: string): Promise<EngagementStats> {
    // Simulate Facebook Graph API GET /{post-id}?fields=likes.summary(true),shares
    return {
      postId,
      likes: Math.floor(Math.random() * 500) + 10,
      shares: Math.floor(Math.random() * 80) + 2,
      comments: Math.floor(Math.random() * 30) + 1,
      reach: Math.floor(Math.random() * 3000) + 500,
    };
  }
}
