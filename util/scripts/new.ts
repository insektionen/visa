import { readdirSync, writeFile } from 'fs';
import path from 'path';
import { TAGS } from '../tags';
import { Tag } from '../types';

const songsPath = path.join(process.cwd(), 'songs');
const tagsPath = path.join(process.cwd(), 'util', 'tags.ts');

const { noPopulate, title, tags } = parseArgs();

const songs = readdirSync(songsPath);
const newSong = `${songs.length}.md`;

if (songs.includes(newSong)) {
	console.log('Something is off with the current song IDs, failed to create new song');
	process.exit(1);
}

writeFile(path.join(songsPath, newSong), fileContent(), (err) => {
	if (err) {
		console.error('An error occured when writing the file');
		console.error(err.name, err.message);
		if (err.stack) console.error(err.stack);
		process.exit(1);
	}

	console.log(`Successfully created new song songs/${newSong}`);
	console.log('Added all possible meta fields to file. Delete any unused fields before a push.');
	if (!title) console.log('Field `title` is required and must be filled');
	if (!tags.length)
		console.log(
			`Field 'tags' must have at least one value, a complete list can be found in ${tagsPath}`
		);
	process.exit(0);
});

function fileContent(): string {
	let content = `---\ntitle: ${title}\n`;
	if (!noPopulate) content += 'author: \nmelody: \ncomposer: \n';
	content += `tags: [${tags.join(', ')}]\n---\n\nLyrics go here\n`;

	return content;
}

function parseArgs(): { noPopulate: boolean; title: string; tags: string[] } {
	const args = process.argv.slice(2, process.argv.length);

	const noPopulateIndex = args.findIndex((v) => v === '--no-pop');
	let noPopulate = false;
	if (noPopulateIndex >= 0) {
		noPopulate = true;
		args.splice(noPopulateIndex, 1);
	}

	const title = args[0] || '';

	const tags = args.slice(1, args.length);
	const invalidTag = tags.find((t) => !TAGS.includes(t as Tag));
	if (invalidTag) {
		console.error(`Tag "${invalidTag}" is not among registered tags`);
		console.error(`A complete list of tags can be found at ${tagsPath}`);
		process.exit(1);
	}

	return { noPopulate, title, tags };
}
