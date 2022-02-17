import assert from 'assert';
import { readdirSync } from 'fs';
import { getAllSongsData, songsPath } from '../util/songs';
import { isSongFileMeta, Song, songKeys } from '../util/types';

describe('Songs files', () => {
	it('Contains only markdown files', () => {
		const files = readdirSync(songsPath);
		const nonMdFile = files.find((file) => file.slice(-3) !== '.md') || null;
		assert.strictEqual(nonMdFile, null, `File '${nonMdFile}' isn't recognized as a markdown file`);
	});

	it("Doesn't have any extra metadata", () => {
		const songs = getAllSongsData(false, true);
		const invalidMeta =
			songs.find((s) => {
				return Object.keys(s).some((k) => !songKeys.includes(k));
			}) || null;
		assert.strictEqual(
			invalidMeta,
			null,
			`Song with ID ${invalidMeta?.id} contains invalid metadata`
		);
	});

	it('All files have IDs as names', () => {
		const files = readdirSync(songsPath);
		const nonNumberFile =
			files.find(
				(file) =>
					!file
						.substring(0, file.length - 3)
						.match(/^(0[^box]*|[1-9])[0-9]*$/ /* regex for an unsigned integer */)
			) || null;

		assert.strictEqual(
			nonNumberFile,
			null,
			`File '${nonNumberFile}' has an invalid name, names must be valid IDs (unsigned integers)`
		);
	});

	it('No files have leading zeroes in their names', () => {
		const ids = readdirSync(songsPath).map((f) => f.substring(0, f.length - 3));
		const leadingZero =
			ids.find(
				(id) => !id.match(/^(0|[1-9][0-9]*)$/ /* Match only numbers without leading zeroes */)
			) || null;

		assert.strictEqual(leadingZero, null, `File '${leadingZero}.md' has leading zeroes`);
	});

	it('No IDs are missing', () => {
		const songs = getAllSongsData(false, true);
		const existsArray: boolean[] = [];
		songs.forEach(({ id }) => (existsArray[id] = true));
		let missing: number | null = null;
		for (let i = 0; i < existsArray.length && missing === null; i++)
			if (existsArray[i] !== true) missing = i;

		assert.strictEqual(missing, null, `The ID ${missing} is missing from the songs folder`);
	});

	it('IDs limited to 4095 (for b64 encoding)', () => {
		const songs = getAllSongsData(false);
		const badId = songs.find(({ id }) => id > 4095)?.id || null;

		assert.strictEqual(
			badId,
			null,
			`ID ${badId} is over the limit, for ease of implementation a soft limit is set at 4095 (64^2).` +
				'\nIf going over this limit is required, please notify all projects dependent on this ahead of time'
		);
	});
});

describe('Songs data', () => {
	it('Contains valid metadata', () => {
		const songs = getAllSongsData(false);
		let nonValidData = songs.find((s) => !isSongFileMeta(s)) || null;
		assert.strictEqual(nonValidData, null, `Song ${nonValidData?.id} has invalid metadata`);
	});

	it('Has only valid content (Unimplemented)');
});
