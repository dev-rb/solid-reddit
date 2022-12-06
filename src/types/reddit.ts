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
	sr_detail: {
		icon_img: string;
	};
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
	post_hint: 'link' | 'image' | 'hosted:video';
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
			p: PreviewImage[];
			s: PreviewImage;
			id: string;
		};
	};
	media: Media | null;
	is_video: boolean;
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
	preview: PreviewImages;
}

export type Media = Gif & Video;

interface Gif {
	oembed: {
		provider_url: string;
		description: string;
		title: string;
		author_name: string;
		height: number;
		width: number;
		html: string;
		thumbnail_width: number;
		version: string;
		provider_name: string;
		thumbnail_url: string;
		type: string;
		thumbnail_height: number;
	};
	type: string;
}

interface Video {
	reddit_video: {
		bitrate_kbps: number;
		fallback_url: string;
		height: number;
		width: number;
		scrubber_media_url: string;
		dash_url: string;
		duration: number;
		hls_url: string;
		is_gif: boolean;
		transcoding_status: string;
	};
}

interface PreviewImages {
	images: {
		source: PreviewImage;
		resolutions: PreviewImage[];
		id: string;
	}[];
}

interface PreviewImage {
	url: string;
	width: number;
	height: number;
}
