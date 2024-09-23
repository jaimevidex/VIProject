import pandas as pd
import numpy as np


def get_genres():
    tracks = pd.read_json('./data/dataset1.json')
    #get the genres column
    genres = tracks['tag']
    #get the unique genres
    unique_genres = np.unique(genres)
    return unique_genres


def get_artists_musics(artists: list) -> dict:
    tracks = pd.read_json('./data/dataset1.json')
    #create a table with only the tracks of the given artists
    tracks = tracks[tracks['artist'].isin(artists)]
    #create a csv file with the table and the same coloums as the original table
    tracks.to_csv('./data/artists_tracks.csv', index=False)
    #return the shape of the table
    return tracks.shape

__name__ = "__main__"
#print(get_genres())
print(get_artists_musics([
    "Kali Malone", "Helado Negro", "Men I Trust", "Toro y Moi", "Crumb", "Soccer Mommy", "Snail Mail", 
    "Shygirl", "Eartheater", "Jean Dawson", "Sudan Archives", "Bakar", "Amaarae", "Snoh Aalegra", 
    "JPEGMAFIA", "Jockstrap", "Serpentwithfeet", "Yves Tumor", "Blood Orange", "Magdalena Bay", 
    "Peggy Gou", "Sega Bodega", "Nilüfer Yanya", "Squid", "Fontaines D.C.", "King Princess", 
    "Tkay Maidza", "Ibeyi", "Arca", "Ravyn Lenae", "Jessie Reyez", "Greentea Peng", "Channel Tres", 
    "Jai Paul", "Noga Erez", "Moses Sumney", "Little Simz", "AURORA", "Charli XCX", "Dorian Electra", 
    "Chai", "Binki", "Rejjie Snow", "070 Shake", "L'Rain", "Genesis Owusu", "HMLTD", "Jade Bird", 
    "Westerman", "Homeshake"
]
))
    