import {
	createResource,
	createSignal,
	Match,
	onMount,
	Show,
	Switch,
} from 'solid-js';
import { Media, PostDetails } from '~/types/reddit';
import styles from './post.module.css';

interface PostProps extends PostDetails {}

const Post = (props: PostProps) => {
	const [subredditDetails] = createResource(async () => {
		const response = await fetch(
			`https://www.reddit.com/r/${props.subreddit}/about.json`
		);
		let subredditDetails = (await response.json()).data;
		// if (subredditDetails.community_icon) {
		// 	subredditDetails.community_icon = (
		// 		subredditDetails.community_icon as string
		// 	).slice(
		// 		0,
		// 		(subredditDetails.community_icon as string).indexOf('.jpg') + 1
		// 	);
		// }
		return subredditDetails;
	});

	const getData = () => {
		return new Date(props.created * 1000).toLocaleDateString();
	};

	const postType = () => {
		if (props.media) {
			return 'media';
		}

		if (props.post_hint === 'image' || props.post_hint === 'link')
			return props.post_hint;

		return 'text';
	};

	const subredditImage =
		subredditDetails()?.community_icon ?? subredditDetails()?.icon_img.length
			? subredditDetails()?.icon_img
			: subredditDetails()?.header_img ?? subredditDetails()?.community_icon;

	return (
		<div class={styles.postContainer}>
			<div class={styles.postInfo}>
				<div class={styles.postSubreddit}>
					<Show when={subredditImage}>
						<img src={subredditImage} />
					</Show>
					<h6 class={styles.postSubredditName}>r/{props.subreddit}</h6>
				</div>
				<div class={styles.postUserDate}>
					<p class={styles.postBy}> Posted By u/{props.author} </p>
					<p class={styles.postCreatedAt}> {getData()} </p>
				</div>
			</div>
			<div class={styles.postContent}>
				<div class={styles.postTitle}>{props.title}</div>
				<div class={styles.postMainContent}>
					<Switch>
						<Match when={postType() === 'text'}>
							<div innerHTML={props.body_html}></div>
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

const LinkContent = (props: PostDetails) => {
	const image = props.preview.images[0].source;
	const url = props.url;

	return (
		<div class={styles.postImage}>
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
