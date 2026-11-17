# Music Trends — Visualizing 60 Years of Popular Music

An interactive dashboard that explores how popular music changed between **1962 and 2021**: which genres dominated, which artists and keywords rose and fell, and how the vocabulary of lyrics shifted over time.

Built with plain **JavaScript + D3 v7** — no framework, no build step.

**[Live demo](https://jaimevidex.github.io/music-trends/)**

## What you can do

- **Scrub the timeline** — a dual-handle slider filters every chart to a year range.
- **Filter by genre** — Rock, Pop, Rap, R&B, Country; *select all* and *reset* shortcuts.
- **Search artists** — type a name and the dashboard narrows to that artist's catalogue.
- **Search keywords** — explore the lyrics vocabulary and see how a word's usage evolves.

## Visual idioms

| Chart | Question it answers |
|---|---|
| **Bar chart** | How many songs per year / per genre? |
| **Bubble chart** | Which artists dominate a period, and how big is their catalogue? |
| **Radar chart** | What is the "fingerprint" of a genre across audio features? |
| **Venn diagram** | How much do genres share artists and keywords? |

Each idiom lives in its own file under `idioms/` and draws from the precomputed tables in `data/`, so the dashboard stays responsive without a backend.

## Data pipeline

The Python scripts in `dataprocessing/` build every table the front end reads:

| Script | Purpose |
|---|---|
| `getSpotifyData.py` | Pulls track metadata and audio features |
| `get_keyword_artists.py` | Resolves artist entities |
| `lyrics_processor.py` | Tokenises lyrics, removes stopwords, extracts keywords |
| `genres_processing.py` | Aggregates per-genre statistics |
| `bubble_chart_processing.py` | Builds the artist bubble table |
| `venn_diagram_processing.py` | Computes genre overlaps |
| `search_tables_processing.py` | Builds the artist/keyword search indexes |
| `main.py` | Runs the pipeline end to end |

Outputs land in `data/*.csv` and are committed, so the site runs with no setup.

## Run locally

ES modules and `fetch` need a real origin, so serve the folder instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html            layout and controls
script.js             state, filtering, chart orchestration
style.css             styling
idioms/               one file per visualization
data/                 precomputed CSVs
dataprocessing/       Python pipeline
report-1.pdf …        three report checkpoints
demo.mp4              demo walkthrough
```

## Notes

The `report-*.pdf` files document the three checkpoints of the project: the initial data study, the visual idioms, and the final evaluation.
