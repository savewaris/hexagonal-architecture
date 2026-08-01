export interface PostContentOptions {
  pageId: string;
  message: string;
  linkUrl?: string;
  imageUrl?: string;
  scheduledPublishTime?: Date;
}

export interface PostResult {
  postId: string;
  pageId: string;
  published: boolean;
  scheduledTime?: Date;
  permalinkUrl?: string;
}

export interface EngagementStats {
  postId: string;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
}

/**
 * Output Port Interface for Social Media Automation (Facebook, X/Twitter, LinkedIn).
 * Decouples automated page posting, scheduling, and analytics from platform APIs.
 */
export interface SocialPlatformPort {
  publishPost(options: PostContentOptions): Promise<PostResult>;
  schedulePost(options: PostContentOptions, publishAt: Date): Promise<PostResult>;
  getEngagementStats(postId: string): Promise<EngagementStats>;
}
