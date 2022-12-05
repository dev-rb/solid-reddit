import styles from './post.module.css';

const Post = () => {
	return (
		<div class={styles.postContainer}>
			<div class={styles.postInfo}>
				<h6 class={styles.postSubreddit}>r/solidjs</h6>
				<div class={styles.postUserDate}>
					<p class={styles.postBy}> Posted By u/Dev-RB </p>
					<p class={styles.postCreatedAt}> 1 hour ago </p>
				</div>
			</div>
			<div class={styles.postContent}>
				<div class={styles.postTitle}>Random Post</div>
				<div class={styles.postMainContent}></div>
			</div>
		</div>
	);
};

export default Post;
