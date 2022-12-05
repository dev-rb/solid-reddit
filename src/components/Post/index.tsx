import { PostDetails } from '~/types/reddit';
import styles from './post.module.css';

interface PostProps extends PostDetails {}

const Post = (props: PostProps) => {
	const getData = () => {
		return new Date(props.created * 1000).toLocaleDateString();
	};

	const postContent = () => {
		if (!props.body && props.preview) {
			console.log(props.preview);
			const image =
				props.preview.images[0].resolutions[
					props.preview.images[0].resolutions.length - 1
				];
			return (
				<div class={styles.postImage}>
					<img src={image.url} width={image.width} height={image.height} />
				</div>
			);
		}
		return props.body;
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
				<div class={styles.postMainContent}>{postContent()}</div>
			</div>
		</div>
	);
};

export default Post;
