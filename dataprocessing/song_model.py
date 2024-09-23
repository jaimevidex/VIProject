class Song:
    def __init__(self, title: str, artist: str, release_date: str, popularity: int, danceability: float, energy: float, key: int, loudness: float, speechiness: float, acousticness: float, instrumentalness: float, liveness: float, valence: float, tempo: float):
        self.title = title
        self.artist = artist
        self.release_date = release_date
        self.popularity = popularity
        self.danceability = danceability
        self.energy = energy
        self.key = key
        self.loudness = loudness
        self.speechiness = speechiness
        self.acousticness = acousticness
        self.instrumentalness = instrumentalness
        self.liveness = liveness
        self.valence = valence
        self.tempo = tempo

    def to_dict(self):
        return {
            "title": self.title,
            "artist": self.artist,
            "release_date": self.release_date,
            "popularity": self.popularity,
            "danceability": self.danceability,
            "energy": self.energy,
            "key": self.key,
            "loudness": self.loudness,
            "speechiness": self.speechiness,
            "acousticness": self.acousticness,
            "instrumentalness": self.instrumentalness,
            "liveness": self.liveness,
            "valence": self.valence,
            "tempo": self.tempo,
        }

    def __repr__(self):
        return f"Song(title={self.title}, artist={self.artist}, release_date={self.release_date}, popularity={self.popularity}, danceability={self.danceability}, energy={self.energy}, key={self.key}, loudness={self.loudness}, speechiness={self.speechiness}, acousticness={self.acousticness}, instrumentalness={self.instrumentalness}, liveness={self.liveness}, valence={self.valence}, tempo={self.tempo}"