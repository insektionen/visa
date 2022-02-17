import { readdirSync, readFileSync } from 'fs';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import path from 'path';
import { getAllSongsData } from '../util/songs';

interface PageProps {
	stats: { value: string | number; title: string; color: string }[];
}

function Stat({
	color = '#000',
	value,
	title,
}: {
	color?: string;
	value: string | number;
	title: string;
}): JSX.Element {
	return (
		<div className="statsBox">
			<span className="stat" style={{ color }}>
				{value}
			</span>
			<span className="statTitle">{title}</span>
		</div>
	);
}

const Home: NextPage<PageProps> = ({ stats }) => {
	return (
		<>
			<Head>
				<title>IN Song API</title>
				<meta name="description" content="The IN-Chapters Songbook API" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<h1>IN-Chapter Songbook API</h1>
				<p>
					This is this IN-Chapters Songs API, to be used for any and all songbook implementations.
				</p>
				<p>
					The real stuff is in the API endpoints, try them out by going to e.g.{' '}
					<code>/api/v1/song/0</code> to get the data for {'"Moder kista"'}, or{' '}
					<code>/api/hello</code> to just see the API say hello.
				</p>
				<h2>Contributing</h2>
				<p>If you want to edit or add songs to the API visit the Github page (Link TBD)</p>
				<p>
					In the future there could be a tool here to help create and edit pages, but until then use
					the Github, instructions are found in <code>README.md</code>.
				</p>

				<h2>Stats</h2>
				<p className="small">This section is incomplete, you can help by expanding it.</p>
				<p className="small">
					If you have any ideas for what should be here go to the Github (Link TBD) make a pull
					request if you can implement it yourself or make an issue to ask for someone elses help in
					implementing it.
				</p>
				<div className="statsContainer">
					{stats.map((stat) => (
						<Stat key={stat.title} {...stat} />
					))}
				</div>
			</main>
		</>
	);
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
	// Total songs
	const songs = getAllSongsData().length;

	// Total unit tests
	let tests = 0;
	readdirSync(path.join(process.cwd(), 'tests')).forEach((t) => {
		const str = readFileSync(path.join(process.cwd(), 'tests', t)).toString();
		tests +=
			str.match(
				/it\(('[^]+?'|"[^]+?"|`[^]+?`),[^]+?\);?/g
				/* Regex to match `it` functions in test files, far from perfect but it works good enough */
			)?.length || 0;
	});

	return {
		props: {
			stats: [
				{ value: songs, title: 'Songs', color: '#4a5' },
				{ value: tests, title: 'Unit tests', color: '#d87' },
			],
		},
	};
};

export default Home;
