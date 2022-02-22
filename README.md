This is the API for the songs for the chapters songbook, this exists only to manage the songs, not manage any version of the songbook.

## Contributing

### Songs

If you want to edit or add songs to the api make a fork of this repo and, once you're happy with your changes/additions, make a Pull Request to have them added to this repo.

Check out [Format](#format) and/or the current songs before making any changes to make sure they conform to the formatting rules.

Songs are kept in the `songs` folder (the rest is testing, utility and the web-app). Any variables (e.g. what are valid `tags`) are kept in the `util` folder. Please try to use the current tags before making new ones.

Before making a Pull Request please make sure to test your changes to make sure they won't break anything. Run tests with:

```sh
yarn install # or npm install
yarn test # or npm run test
```

**Note:** Tests will automatically run for every Push and Pull request

### The web-app

Maybe you want to have more statistics visualized or make a tool to make it easier to edit and add songs for people who've never worked with markdown or git before? If you want to change something about the web-app (link TBD) make a fork and submit a Pull request when you're done!

## Format

Every song is stored as a markdown file containing some metadata and the content of the song.

### Metadata

The metadata is stored as front matter in `YAML` format. You can learn more about YAML from [the YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/), or, in short, all files start with a section defined by leading and tailing `---` which contains keys and values.

The metadata can contain the following attributes:

- `title`: **Required!** The name of the song
- `author`: The author of the song or it's origin. As short as possible.
- `melody`: The melody the song should be sung with.
- `composer`: The composer of the melody. As short as possible.
- `tags`: **At least one!** Tags that define some attributes of the song such as if it's a `punch` song, the language it's sung in (`swe`, `eng`, etc.). A complete list of tags can be found [here](util/tags.ts).
- `deleted`: Instead of removing files they should be marked as deleted as to not break any links. If included it should only ever have the value `true`.

Take a look at the [file for "Moder Kista"](songs/0.md) for an example of a full set of metadata.

### Content (lyrics)

The song content is everything below the front matter in the song files.

Right now very little markdown is actually supported as legacy versions of the data needs to be maintained. Currently supported markdown includes:

- `#` (`h1`, header)
- `>` (blockquotes, treated as comments)
- standard paragraphs

If a song you wish to add needs more options please first add an issue or Pull request to add support for it in legacy versions.

Look at ["Jag har aldrig..."](songs/10.md) for an example of headers and ["Kalmarevisan"](songs/12.md) for an example of comments (blockquotes).
