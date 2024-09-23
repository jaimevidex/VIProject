import pandas as pd
import numpy as np
import spotipy
import time
from spotipy.oauth2 import SpotifyClientCredentials
from typing import List
from song_model import Song


#use proxy rotator to do the requests
#main()
#proxy = get_random_proxy()



client_id1 = '1b810083d5794ae398cbda52e18d0e26'
client_secret1 = '6f8a9fe72dcd474dbec0c7a05d856fb0'
client_credentials_manager1 = SpotifyClientCredentials(client_id=client_id1, client_secret=client_secret1)
sp1 = spotipy.Spotify(client_credentials_manager=client_credentials_manager1)

client_id2 = '6849718d9cb54a9ab04408e958128955'
client_secret2 = '88359e509bd9410f96797f06531d2217'
client_credentials_manager2 = SpotifyClientCredentials(client_id=client_id2, client_secret=client_secret2)
sp2 = spotipy.Spotify(client_credentials_manager=client_credentials_manager2)

client_id3 = '682074b65bf34c2eabcc730e2c8e8392'
client_secret3 = '964b0edfbda54cafb9114a400cbd9ff0'
client_credentials_manager3 = SpotifyClientCredentials(client_id=client_id3, client_secret=client_secret3)
sp3 = spotipy.Spotify(client_credentials_manager=client_credentials_manager3)

client_id4 = '86d73f719ea7482b8249a4e1f47d689e'
client_secret4 = 'bd174da1b75f42f3a688fa3af99a8cde'
client_credentials_manager4 = SpotifyClientCredentials(client_id=client_id4, client_secret=client_secret4)
sp4 = spotipy.Spotify(client_credentials_manager=client_credentials_manager4)

def searchTrack(query: list[str]) -> Song:
    result = sp4.search(query, limit=50)
    #get all track ids
    track_ids = []
    for track in result["tracks"]["items"]:
        track_ids.append(track["id"])
    #get all features for the tracks
    features = sp4.audio_features(track_ids)
    
    songs = []
    #create a song object for each track using the features and only keeping the name, artist, and release date of the initial search and going through the result with index and check if any of the features are None
    for index, track in enumerate(result["tracks"]["items"]):
        if features[index] is None:
            continue
        song = Song(
            title=track["name"],
            artist=track["artists"][0]["name"],
            release_date=track["album"]["release_date"],
            popularity=track["popularity"],
            danceability=features[index]["danceability"],
            energy=features[index]["energy"],
            key=features[index]["key"],
            loudness=features[index]["loudness"],
            speechiness=features[index]["speechiness"],
            acousticness=features[index]["acousticness"],
            instrumentalness=features[index]["instrumentalness"],
            liveness=features[index]["liveness"],
            valence=features[index]["valence"],
            tempo=features[index]["tempo"],
        )
        songs.append(song)
    
    return songs

def getSongNames(file: str) -> List[str]:
    # Receive a CSV file with songs and return an array with the columns title and artist concatenated
    df = pd.read_csv(file)
    songs = []
    for _, row in df.iterrows():
        songs.append(row['title'] + " " + row['artist'])
    return songs

if __name__ == "__main__":
  #create csv fil with column names
  df = pd.DataFrame(columns=["index","title", "artist", "release_date", "popularity", "danceability", "energy", "key", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo", "time_signature"])
  #df.to_csv('data.csv', index=False)

  results = getSongNames("./data/artists_tracks.csv")
  #search for songs 50 at a time
  for i in range(0, len(results), 50):
    songs = searchTrack(results[i:i+50])
    for song in songs:
        df = pd.DataFrame(song.to_dict(), index=[0])
        df.to_csv('data.csv', mode='a', header=False)
    time.sleep(1)