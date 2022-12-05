export interface Posts {
	kind: string;
	data: Post;
}

interface Post {
	children: PostInfo[];
}

export interface PostInfo {
	kind: string;
	data: PostDetails;
}

export interface PostDetails {
	body: string;
	body_html: string;
	subreddit: string;
	title: string;
	downs: number;
	name: string;
	ups: number;
	score: number;
	edited: number | boolean;
	created: number;
	archived: boolean;
	is_crosspostable: boolean;
	over_18: boolean;
	spoiler: boolean;
	locked: boolean;
	subreddit_id: string;
	id: string;
	post_hint: 'link' | 'image';
	gallery_data: {
		items: {
			caption?: string;
			media_id: string;
			id: number;
		}[];
	};
	media_metadata: {
		[k in string]: {
			status: string;
			e: string;
			m: string;
			p: {
				x: number;
				y: number;
				u: string;
			}[];
			s: {
				x: number;
				y: number;
				u: string;
			};
			id: string;
		};
	};
	author: string;
	num_comments: number;
	permalink: string;
	url: string;
	created_utc: number;
	num_crossposts: number;
	thumbnail: string | null;
	thumbnail_width: number | null;
	thumbnail_height: number | null;
	domain: string | null;
	preview: {
		images: {
			source: { url: string; width: number; height: number };
			resolutions: { url: string; width: number; height: number }[];
			id: string;
		}[];
	};
}
