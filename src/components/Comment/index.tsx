import { createTimeAgo } from '@solid-primitives/date';
import { useNavigate } from 'solid-start';
import { CommentDetails } from '~/types/reddit';
import { CommentIcon } from '../icons/CommentIcon';
import { UpvoteIcon, DownvoteIcon } from '../icons/VoteIcons';
import styles from './comment.module.css';
import sanitize from 'sanitize-html';

interface CommentProps extends CommentDetails {}

const Comment = (props: CommentProps) => {
	const [diff] = createTimeAgo(props.created_utc * 1000);

	// const subredditIcon =
	// 	props.sr_detail?.community_icon ?? props.sr_detail?.icon_img;

	const commentScore =
		props.score > 1000 ? (props.score / 1000).toFixed(1) + 'k' : props.score;

	return (
		<div class={styles.comment}>
			<div class={styles.commentContainer}>
				<div class={styles.commentInfo}>
					{/* <div class={styles.commentSubreddit}>
						<Show when={subredditIcon} fallback={<FallbackIcon />}>
							<img src={subredditIcon!} />
						</Show>
						<h6 class={styles.commentSubredditName}>r/{props.subreddit}</h6>
					</div> */}
					<div class={styles.commentUserDate}>
						<p class={styles.commentBy}> u/{props.author} </p>
						<p class={styles.commentCreatedAt}> {diff()} </p>
					</div>
				</div>
				<div class={styles.commentContent}>
					<div class={styles.commentTitle}>{props.title}</div>
					<div class={styles.commentMainContent}>
						<div
							innerHTML={sanitize(props.body_html, {
								transformTags: { a: 'p' },
							})}
						></div>
					</div>
				</div>
				<div class={styles.commentInteractions}>
					<div class={styles.commentVotes}>
						<button class={`${styles.vote} ${styles.upvote}`}>
							<UpvoteIcon />
						</button>
						<span class={styles.commentScore}> {commentScore} </span>
						<button class={`${styles.vote} ${styles.downvote}`}>
							<DownvoteIcon />
						</button>
					</div>
					<button class={`unstyled-button ${styles.commentComments}`}>
						{/* <CommentIcon /> */}
						{/* <span>{props.replies.data.children.length} Comments</span> */}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Comment;
