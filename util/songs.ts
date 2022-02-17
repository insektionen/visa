import { readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { Song, SongFileMeta } from './types';

export const songsPath = path.join(process.cwd(), 'songs');

/**
 * Removes any leading or trailing newlines
 * @param content to clean
 * @returns cleaned content
 */
export function cleanContent(content: string): string {
	let start, end;
	for (start = 0; content[start] === '\n'; start++) {}
	for (end = content.length; content[end - 1] === '\n'; end--) {}
	return content.substring(start, end);
}

/**
 * Gets the data for a song with the given id
 *
 * **Warning:** doesn't validate the id so it's unsafe to run for song id's that don't exist
 * @param song the id for the song to read, as either a number or a string
 * @returns The data for the song
 */
export function getSongData(song: string | number): Song {
	const { content, data } = matter(readFileSync(path.join(songsPath, `${song}.md`)));
	// Could use isSongFileMeta to make sure that the data acctually is valid, but all files should
	// have been tested to make sure they are valid before this so there's no need
	const metaData = data as SongFileMeta;

	return { content: cleanContent(content), ...metaData, id: Number(song) };
}

/**
 * Gets every songs data
 * @param sorted sorts the songs before returning them, defaults to `true`
 * @returns All songs data
 */
export function getAllSongsData(sorted: boolean = true, includeDeleted: boolean = false): Song[] {
	const files = readdirSync(songsPath);
	let songs: Song[] = [];
	files.forEach((file) => {
		const data = getSongData(file.substring(0, file.length - 3));
		if (!data.deleted || includeDeleted)
			songs.push(getSongData(file.substring(0, file.length - 3)));
	});

	if (sorted) songs.sort((a, b) => a.id - b.id);

	return songs;
}

export const SONG_METADATA_KEYS = <const>['title', 'author', 'melody', 'composer', 'tags'];
