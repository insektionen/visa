import { existsSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { getSongData, songsPath } from '../../../../util/songs';
import { ResData, Song } from '../../../../util/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<ResData<Song>>) {
	const { id } = req.query;
	const filePath = path.join(songsPath, `${id}.md`);
	if (!existsSync(filePath))
		return res.status(404).json({ error: `Song with id ${id} doesn't exits` });

	const song = getSongData(id as string);

	res.status(200).json(song);
}
