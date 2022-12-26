import { For, Show } from 'solid-js';
import {
	createRouteData,
	RouteDataArgs,
	useParams,
	useRouteData,
} from 'solid-start';
import Post from '~/components/Post';
import { Posts } from '~/types/reddit';

export function routeData({ params }: RouteDataArgs) {
	return createRouteData(
		async () => {
			const response = await fetch(
				`https://www.reddit.com/r/${params.subreddit}.json?limit=50&raw_json=1&sr_detail=1`
			);

			return ((await response.json()) as Posts).data.children;
		},
		{
			key: () => params.subreddit,
		}
	);
}

export default function SubredditPage() {
	const subredditPosts = useRouteData<typeof routeData>();

	const params = useParams();

	return (
		<Show when={subredditPosts()}>
			<div class="posts-listing">
				<h2> r/ {params.subreddit} </h2>
				<For each={subredditPosts()}>{(post) => <Post {...post.data} />}</For>
			</div>
		</Show>
	);
}
