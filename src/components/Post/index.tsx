import { createSignal, Match, onMount, Switch } from 'solid-js';
import { Media, PostDetails } from '~/types/reddit';
import styles from './post.module.css';

interface PostProps extends PostDetails {}

const Post = (props: PostProps) => {
	const getData = () => {
		return new Date(props.created * 1000).toLocaleDateString();
	};

	const getMediaDetails = () => {
		const media = props.media;
		if (media !== null) {
			if (props.is_video) {
				let videoInfo = media.reddit_video;

				return videoInfo;
			} else {
				let gifInfo = media.oembed;

				return gifInfo;
			}
		} else if (props.post_hint === 'image') {
			return props.preview.images;
		}
	};

	const postContent = () => {
		if (!props.body && props.preview) {
			const image =
				props.preview.images[0].resolutions[
					props.preview.images[0].resolutions.length - 1
				];
			return (
				<div class={styles.postImage}>
					<img src={image.url} />
				</div>
			);
		}
		return props.body;
	};

	const postType = () => {
		if (props.media) {
			return 'media';
		}

		if (props.post_hint === 'image') return 'image';

		return 'text';
	};

	return (
		<div class={styles.postContainer}>
			<div class={styles.postInfo}>
				<h6 class={styles.postSubreddit}>r/{props.subreddit}</h6>
				<div class={styles.postUserDate}>
					<p class={styles.postBy}> Posted By u/{props.author} </p>
					<p class={styles.postCreatedAt}> {getData()} </p>
				</div>
			</div>
			<div class={styles.postContent}>
				<div class={styles.postTitle}>{props.title}</div>
				<div class={styles.postMainContent}>
					<Switch>
						<Match when={postType() === 'text' || postType() === 'image'}>
							{postContent()}
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
	);
};

export default Post;

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
		<div class={styles.videoContent}>
			{/* <div class={styles.videoOverlay} data-playing={playing()}></div> */}
			<video ref={setVideoPlayer} src={videoDetails.fallback_url} controls />
		</div>
	);
};

const GifContent = (props: Media) => {
	const gifDetails = props.oembed;

	return <div innerHTML={gifDetails.html}></div>;
};
