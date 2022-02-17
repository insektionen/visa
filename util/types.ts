import { TAGS } from './tags';

export type ResData<T = unknown> = { error: string } | T;

export type Tag = typeof TAGS[number];

export interface Song {
	id: number;
	title: string;
	author?: string;
	melody?: string;
	composer?: string;
	tags: Tag[];
	content: string;
	deleted?: true;
}

// Can't find a way to do this automatically
export const songKeys = [
	'id',
	'title',
	'author',
	'melody',
	'composer',
	'tags',
	'content',
	'deleted',
];

export type SongFile = Omit<Song, 'id'>;

export type SongMeta = Omit<Song, 'content'>;

export type SongFileMeta = Omit<SongMeta, 'id'>;

export function isSongFileMeta(meta: any): meta is SongFileMeta {
	return (
		typeof meta === 'object' &&
		typeof (meta as SongFileMeta).title === 'string' &&
		['string', 'undefined'].includes(typeof (meta as SongFileMeta).author) &&
		['string', 'undefined'].includes(typeof (meta as SongFileMeta).melody) &&
		['string', 'undefined'].includes(typeof (meta as SongFileMeta).composer) &&
		Array.isArray((meta as SongFileMeta).tags) &&
		(meta as SongFileMeta).tags.length > 0 &&
		// Checks that no tag in the meta.tags array isn't part of the TAGS constants array
		!(meta as SongFileMeta).tags.some((e) => !TAGS.includes(e)) &&
		[true, undefined].includes((meta as SongFileMeta).deleted)
	);
}
