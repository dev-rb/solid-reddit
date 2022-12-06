import { createTimeAgo } from '@solid-primitives/date';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { Media, PostDetails } from '~/types/reddit';
import { CommentIcon } from '../icons/CommentIcon';
import { FallbackIcon } from '../icons/SubredditFallbackIcon';
import { UpvoteIcon, DownvoteIcon } from '../icons/VoteIcons';
import styles from './post.module.css';

interface PostProps extends PostDetails {}

const Post = (props: PostProps) => {
	const [diff] = createTimeAgo(props.created * 1000);

	const postType = () => {
		if (props.media) {
			return 'media';
		}

		if (props.post_hint === 'image' || props.post_hint === 'link')
			return props.post_hint;

		return 'text';
	};

	const subredditIcon =
		props.sr_detail?.community_icon ?? props.sr_detail?.icon_img;

	const postScore =
		props.score > 1000 ? (props.score / 1000).toFixed(1) + 'k' : props.score;

	return (
		<div class={styles.post}>
			<div class={styles.postVotes}>
				<button class={`${styles.vote} ${styles.upvote}`}>
					<UpvoteIcon />
				</button>
				<span class={styles.postScore}> {postScore} </span>
				<button class={`${styles.vote} ${styles.downvote}`}>
					<DownvoteIcon />
				</button>
			</div>
			<div class={styles.postContainer}>
				<div class={styles.postInfo}>
					<div class={styles.postSubreddit}>
						<Show when={subredditIcon} fallback={<FallbackIcon />}>
							<img src={subredditIcon!} />
						</Show>
						<h6 class={styles.postSubredditName}>r/{props.subreddit}</h6>
					</div>
					<div class={styles.postUserDate}>
						<p class={styles.postBy}> Posted By u/{props.author} </p>
						<p class={styles.postCreatedAt}> {diff()} </p>
					</div>
				</div>
				<div class={styles.postContent}>
					<div class={styles.postTitle}>{props.title}</div>
					<div class={styles.postMainContent}>
						<Switch>
							<Match when={postType() === 'text'}>
								<Show when={props.selftext.length}>
									<div class={styles.textContent}> {props.selftext} </div>
								</Show>
							</Match>

							<Match when={postType() === 'image'}>
								<ImageContent {...props} />
							</Match>

							<Match when={postType() === 'link'}>
								<LinkContent {...props} />
							</Match>

							<Match when={postType() === 'media'}>
								<Switch>
									<Match when={props.is_video}>
										<VideoContent {...props.media!} />
									</Match>

									<Match when={!props.is_video}>
										<GifContent {...props.media!} />
									</Match>
								</Switch>
							</Match>
						</Switch>
					</div>
				</div>
				<div class={styles.postInteractions}>
					<button class={`unstyled-button ${styles.postComments}`}>
						<CommentIcon />
						<span>{props.num_comments} Comments</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Post;

const ImageContent = (props: PostDetails) => {
	const image =
		props.preview.images[0].resolutions[
			props.preview.images[0].resolutions.length - 1
		];

	return (
		<div class={styles.postImage}>
			<img src={image.url} />
		</div>
	);
};

const VideoContent = (props: Media) => {
	const [videoPlayer, setVideoPlayer] = createSignal<HTMLVideoElement>();

	const [playing, setPlaying] = createSignal(false);

	const videoDetails = props.reddit_video;

	const togglePlay = () => {
		const nextValue = !playing();

		if (nextValue) {
			videoPlayer()?.play();
		} else {
			videoPlayer()?.pause();
		}

		setPlaying(nextValue);
	};

	// onMount(() => {
	// 	if (videoPlayer()) {
	// 		videoPlayer()!.addEventListener('pause', () => {
	// 			setPlaying(false);
	// 		});
	// 	}
	// });

	return (
		<div class={`${styles.videoContent} video-content`}>
			{/* <div class={styles.videoOverlay} data-playing={playing()}></div> */}
			<video ref={setVideoPlayer} src={videoDetails.fallback_url} controls />
		</div>
	);
};

const GifContent = (props: Media) => {
	const gifDetails = props.oembed;

	return <div class={'gif-content'} innerHTML={gifDetails.html}></div>;
};

const LinkContent = (props: PostDetails) => {
	const image = props.preview.images[0].source;
	const url = props.url;

	return (
		<div class={`${styles.postImage} link-content`}>
			<div class={styles.postImageOverlay}></div>
			<img src={image.url} />
			<div class={styles.linkOverlay}>
				<a href={url} title={url}>
					{url}
				</a>
			</div>
		</div>
	);
};
