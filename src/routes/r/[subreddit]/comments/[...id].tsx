import { For, Show } from 'solid-js';
import { createRouteData, RouteDataArgs, useRouteData } from 'solid-start';
import Comment from '~/components/Comment';
import Post from '~/components/Post';
import { PostDetails, RedditCommentRoot } from '~/types/reddit';

export function routeData({ params }: RouteDataArgs) {
	return createRouteData(
		async (key) => {
			const response = await fetch(
				`https://www.reddit.com/r/${params.subreddit}/comments/${key}.json?raw_json=1`
			);

			const comments = (await response.json()) as RedditCommentRoot[];
			const originalPost = comments[0].data.children[0]
				.data as unknown as PostDetails;
			return {
				originalPost,
				comments: comments[1].data.children.slice(
					0,
					comments[1].data.children.length - 1
				),
			};
		},
		{
			key: () => params.id,
		}
	);
}

export default function Comments() {
	const comments = useRouteData<typeof routeData>();

	return (
		<Show when={comments()}>
			<div class="comments-listing">
				<Post {...comments()!.originalPost} />
				<For each={comments()?.comments}>
					{(comment) => <Comment {...comment.data} />}
				</For>
			</div>
		</Show>
	);
}
