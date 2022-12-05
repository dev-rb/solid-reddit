import { For, Show } from 'solid-js';
import { createRouteData, Title, useRouteData } from 'solid-start';
import Post from '~/components/Post';
import { Posts } from '~/types/reddit';

export function routeData() {
	return createRouteData(async () => {
		const response = await fetch(
			'https://www.reddit.com/hot.json?limit=100&raw_json=1'
		);

		return ((await response.json()) as Posts).data.children;
	});
}

export default function Home() {
	const popularPosts = useRouteData<typeof routeData>();

	return (
		<main>
			<Title>Solid Reddit</Title>
			<div class="posts-listing">
				<Show when={popularPosts()}>
					<For each={popularPosts()}>{(post) => <Post {...post.data} />}</For>
				</Show>
			</div>
		</main>
	);
}
