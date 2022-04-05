import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllSongsData } from '../../../util/songs';
import { LEGACY_MAP, UNKNOWN } from '../../../util/tags';
import { ResData, Song } from '../../../util/types';

export default function handler(_req: NextApiRequest, res: NextApiResponse<ResData<string>>) {
	const songs = getAllSongsData();

	let xml =
		'<?xml version="1.0" encoding="utf-8"?>' +
		'<songs description="IN-sektionens sångbok, Strängteoretiquernas reviderade version ' +
		'(2009-2015)" updated="2018-05-02">';
	// Put strings in an array first to preserve order of songs
	songs.forEach((song) => {
		xml += `<song ${songMetaToXml(song)}>`;
		// TODO: Properly parse content (`md`) to legacy (`xml`), i.e. handle comment
		song.content.split('\n\n').forEach((p) => {
			if (p.match(/^(# )[^]+$/)) xml += `<header>${xmlContent(p, 2)}</header>`;
			else if (p.match(/^(> )[^]+$/))
				xml += `<comment>${xmlContent(
					// markdown uses a `> ` on each line to denote a blockqoute with newlines
					p
						.split('\n')
						.map((l) => l.substring(2))
						.join('\n')
				)}</comment>`;
			else xml += `<p>${xmlContent(p)}</p>`;
		});
		xml += '</song>';
	});

	xml += '</songs>';

	res.status(200).send(xml);
}

/**
 * Make the song metadata into xml attributes
 * @param song the song to read the metadata from
 * @returns the metadata attributes for the xml <song> element
 */
function songMetaToXml(song: Song): string {
	let meta = `name="${song.title}"`;
	if (song.author) meta += ` author="${song.author}"`;

	// Sets first found legacy tag as the category, if none found sets as unknown
	let cat: string | null = null;
	for (let i = 0; i < song.tags.length; i++) {
		if ((LEGACY_MAP as Record<string, string>)[song.tags[i]]) {
			cat = (LEGACY_MAP as Record<string, string>)[song.tags[i]];
			break;
		}
	}
	meta += ` category="${cat || LEGACY_MAP[UNKNOWN]}"`;

	if (song.composer) meta += ` composer="${song.composer}"`;
	if (song.melody) meta += ` melody="${song.melody}"`;

	return meta;
}

/**
 * formats markdown content to legacy xml content
 * @param content content to transform `md` -> `xml`
 * @returns xml-ized content
 */
function xmlContent(
	content: string,
	removeStart: number = 0,
	removeEnd: number = content.length
): string {
	// TODO: When songs are added that use e.g. bold, italic or inline code make sure they are
	// converted to the correct tags
	return content.substring(removeStart, removeEnd).replace(/\\\*/g, '*').replace(/\\#/g, '#');
}
