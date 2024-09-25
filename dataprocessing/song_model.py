class Song:
    def __init__(self, title: str, artist: str, popularity: int, danceability: float, energy: float, key: int, speechiness: float, acousticness: float, instrumentalness: float, valence: float, tempo: float):
        self.title = title
        self.artist = artist
        self.popularity = popularity
        self.danceability = danceability
        self.energy = energy
        self.key = key
        self.speechiness = speechiness
        self.acousticness = acousticness
        self.instrumentalness = instrumentalness
        self.valence = valence
        self.tempo = tempo

    def to_dict(self):
        return {
            "title": self.title,
            "artist": self.artist,
            "popularity": self.popularity,
            "danceability": self.danceability,
            "energy": self.energy,
            "key": self.key,
            "speechiness": self.speechiness,
            "acousticness": self.acousticness,
            "instrumentalness": self.instrumentalness,
            "valence": self.valence,
            "tempo": self.tempo,
        }

    def __repr__(self):
        return f"Song(title={self.title}, artist={self.artist}, popularity={self.popularity}, danceability={self.danceability}, energy={self.energy}, key={self.key}, speechiness={self.speechiness}, acousticness={self.acousticness}, instrumentalness={self.instrumentalness}, valence={self.valence}, tempo={self.tempo}"