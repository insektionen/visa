import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllSongsData } from '../../../util/songs';
import { ResData, Song } from '../../../util/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<ResData<Song[]>>) {
	res.status(200).json(getAllSongsData());
}
