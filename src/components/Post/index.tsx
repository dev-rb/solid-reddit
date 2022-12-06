import { createTimeAgo } from '@solid-primitives/date';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { Media, PostDetails } from '~/types/reddit';
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
								<div class={styles.textContent}> {props.selftext} </div>
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
			</div>
		</div>
	);
};

export default Post;

const FallbackIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			class="fallback-subreddit-icon"
		>
			<path d="M16.5,2.924,11.264,15.551H9.91L15.461,2.139h.074a9.721,9.721,0,1,0,.967.785ZM8.475,8.435a1.635,1.635,0,0,0-.233.868v4.2H6.629V6.2H8.174v.93h.041a2.927,2.927,0,0,1,1.008-.745,3.384,3.384,0,0,1,1.453-.294,3.244,3.244,0,0,1,.7.068,1.931,1.931,0,0,1,.458.151l-.656,1.558a2.174,2.174,0,0,0-1.067-.246,2.159,2.159,0,0,0-.981.215A1.59,1.59,0,0,0,8.475,8.435Z"></path>
		</svg>
	);
};

const UpvoteIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601L17.919 12H15z"
			/>
		</svg>
	);
};

const DownvoteIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399L6.081 12H10V4h4v8h3.919L12 19.399z"
			/>
		</svg>
	);
};

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
