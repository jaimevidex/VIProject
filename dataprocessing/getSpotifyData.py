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

def get_artists_musics(artists: list) -> dict:
    tracks = pd.read_json('./data/dataset1.json')
    #create a table with only the tracks of the given artists
    tracks = tracks[tracks['artist'].isin(artists)]
    #create a csv file with the table and the same coloums as the original table
    tracks.to_csv('./data/artists_tracks.csv', index=False)
    #return the shape of the table
    return tracks.shape

def get_artists() -> list[int]:
    df = pd.read_json('./data/dataset1.json')
    #get artists already in the dataset
    checked_artists = pd.read_csv('./data/no_dups_data.csv')['artist'].unique().tolist()
    #return artists that are not already in the dataset
    return [artist for artist in df['artist'].unique().tolist() if artist not in checked_artists]

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
            popularity=track["popularity"],
            danceability=features[index]["danceability"],
            energy=features[index]["energy"],
            key=features[index]["key"],
            speechiness=features[index]["speechiness"],
            acousticness=features[index]["acousticness"],
            instrumentalness=features[index]["instrumentalness"],
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
  df = pd.DataFrame(columns=["index","title", "artist", "popularity", "danceability", "energy", "key", "speechiness", "acousticness", "instrumentalness", "valence", "tempo", "time_signature"])
  #df.to_csv('data.csv', index=False)

  results = getSongNames("./data/artists_tracks.csv")
  #search for songs 50 at a time
  for i in range(0, len(results), 50):
    songs = searchTrack(results[i:i+50])
    for song in songs:
        df = pd.DataFrame(song.to_dict(), index=[0])
        df.to_csv('./data/data.csv', mode='a', header=False)
    time.sleep(1)

get_artists_musics(['Sylvy', 'Laycon', 'Girls Under Glass', "Je'Melody", 'Swallowed', 'SporatiK',
 'Josh Atticus', 'AE MAK', 'Loorr k', 'Jussin', 'Marshmello & Juicy J',
 'Cade Hoppe', 'Luke Genarro', 'Twisted Tower Dire', 'To Be Gentle',
 'Poetic Killa', 'Courtney Bell', 'TiaN', 'SA Zeiner', 'Emmett D. Carson',
 'Trek', 'Dylan House', 'Julie Reeves', 'Okezzy', 'Lindsay Bruce',
 'Blue moon ring', 'Laura Mvula', 'Damageplan', 'Autmn Rains', 'Xzay, Zalen',
 'ERYS (Jaden Smith)', 'OHMYGAB', 'Padre Official', 'Jonny Wild',
 'UNAVERAGE GANG & Black Smurf', 'Cask Mouse', 'OELuhHot', 'Lcia Moniz',
 '29PG', 'Cheyenne Goss', 'Lil Jaywalk', 'Dasha Grady', 'Rachel Rabin',
 'Nathaniel Ly, Aaron Fung', 'Jochi', 'Blaine Nasser', 'Winston Ward',
 'Julie Rogers', 'Ray Daytona and Googoobombos', 'Shark Breach & GHOSTIE',
 'MazGazi', 'Luqman Swati', 'Juicy checks', 'Next Step Down', 'Ruga',
 'King Ant', 'Alice Walker', 'Wfgwertg', 'WhipGF', 'MARS (Band)', 'J.R. Sharp',
 'Shelley Fabares', 'The Funny Gang', 'Jediah', 'Chainsaw Disaster',
 'SoSadSahvage', 'La Neverland', 'Wisdom Agbonghae', 'DJ Rashad', 'Dan Kye',
 'Pink Mario', 'Tora & Anna Boi', 'Amir Latran', 'Lupe Venzetti',
 'Devon Gilfillian', 'Carl Wayne', 'Alexander.S.Williams', 'King James III',
 'Tasha Duncan', 'Mondo Mason', 'Sardine12', 'NextupK', 'YNW SKI-G',
 'J.J. The Rapper', 'Lil frooty', 'Jinc Ent.', 'Nick Bostrom',
 'Tony Rose (Folk Singer)', 'Ynot and Lil Hibachi', 'Elias Lnnrot',
 'Sweet & Lynch', 'LEVR & Akacia', 'OfficialMindOfBlur', 'Danilyon', 'Jadon',
 'Freddie Raymond', 'KG Jay', 'EPIC // 555', 'PaKKman Mickyson',
 'Bands a Make Her Dance', 'Scooter & Xillions', 'Icedcoffeesodacan',
 'Arthur (Hip-Hop/R&B/Rap)', 'Insanian', 'Maseo', 'Gene Stratton-Porter',
 'Peter Wackel', 'Steve Hogarth', 'Matteo Ranieri', 'Fair Sex', 'Patti Jerome',
 'Ethan Logsdon', 'Steiner & Madlaina', 'ReytheCoolestLoser', 'Sunny Lukas',
 'GospelbeacH', 'Carl Sandburg', 'Stephen McNulty', 'French Park',
 'Yekim, Radio Big Mack', 'Olivia Herdt', 'Schilly', 'Nada909',
 'Joyce & Johnita Collins', 'Satellite', 'Versailles The Everything',
 'Beres Hammond & Popcaan', 'Damde8', 'Josh Saint', 'InfoFlo Pay', 'GLO 9',
 'Stockholm Monsters', '9TEEN (eng)', 'BARUCH', 'TheWACKYCOLLECTIVE',
 'Chocolate Droppa', 'NaviWDGT', 'Sheryl Crow & Johnny Cash', 'Lonli',
 'DraconiteDragon', 'Lazy Rios', 'Oli Lover', 'Weedpill', 'Precious Paris',
 'ShaunyFresh', 'Far Radio Clouds', 'Wy', 'Mrs. Wave', 'KGizzle', 'Maqo',
 'Wildcat', 'Cheap Thrills Lyrics - Sia', 'American Watercolors',
 'Armond WakeUp', 'Lil Saaf', 'Penis man', 'Jesse Campbell', 'Michael Franks',
 'Moon Bee', 'Rachel Bay Jones & Jennifer Laura Thompson', 'Trill Carl',
 'Ceezy FG', 'Apollyon Sun',
 'DJ Blackstone & Luxe 54 featuring A Taste Of Honey', 'Falsetto', 'Jaloo',
 'Big M', 'Myles Jacob', 'External Fields', 'Benjamin Hastings', 'Moralz40',
 'Corey James x Crusy & Jose De Mara', 'BdotAdot5', 'Yellowflowers',
 'Skeng HeI', 'Ranger Justin', 'Jan Slauerhoff', 'Joaquin corvalan',
 'Jeffrey McDaniel', 'Austin Underwood, Timothy Love', 'Hunter Nottingham',
 'ANMLPLNET', 'Hide And Seek', 'Kidd Keo & POUNDZ', 'Aaron McGonzo',
 'Mr. Wells', 'NYC DJ', 'Silence Is A Virus', 'Izzy Marcil', 'Gladius',
 "David Cronenberg's Wife" 'UwerMine', 'VeeDeshNee', 'Fam (R&B)',
 'William Allingham', 'Linear Downfall', 'Cirrha Niva',
 'Tjay Hayes (aka Baby Rich)', 'Le Motif', 'Alex Medrano', 'The Icicle Works',
 'Get the Gat (Clean)', 'Shogun', 'Gil Wilson', 'David Trobisch', 'Suzy Jones',
 'Carrie Premiere Cast, Michael Gore', 'Angel Crew', 'The Sons of Pitches',
 'The Motion Mosaic', 'Ben Brinton', 'The Cold Cuts', 'Grimlxck',
 'Lady Breezy', 'Hypnogaja', 'Xaphoon Jones & AC Slater', 'Dan Ganja',
 'The Atypicals', 'Shahul Habib', 'Quaro', 'Lonesome George', 'Ashfawks',
 'Pounder (Metal Band)', 'Ronald Larry', 'DC D-Nice', 'Monopoly Mane',
 'Meno N Envy', 'Kinj K.A.D.E, Yung Suxge & NED', 'The Phats Brothers',
 'CamelPhat & ARTBAT', 'JKD Kozart', 'Plotinus', 'Traco$', 'WAKJDSKL WJKASD',
 'Kid Cuebas', 'James Vane', 'Lil $horty', 'La Goony Chonga', 'Teleport',
 'Ryan Smooth', 'Z.E', 'New Kids On Your Mom', 'Zafra', 'perobug',
 'Rachel Pereira', 'XXXbrownie', 'Themselves', 'J Craft', 'G Felling',
 'Branch Stuffpuff', 'Thomasondatrack', 'RCK Media', 'Big Boy Pete',
 'Austin Chua', 'Ken Randle', 'WaterBoy130',
 'Jimmie Blythe And His Ragmuffins', 'Love potion', 'Shirugoth', 'State',
 "D'Yani" 'Empr3$$', 'Sa Vich', 'MaMan ft J and Nadine', 'HAVEN (US)',
 'HorsieRebel', 'Moodle-Tang Clan', 'The Empiire', 'Lisa Loeb & Nine Stories',
 'Savesaint', '10Tik', 'The Moonsoon Bassoon', 'Unity Klan', 'Strand, Mark',
 'Dalek I Love You', 'Yung $weeet', 'Proxy War', 'Huzsuh',
 'Manny K, Keire Stone', 'Charlie and the bhoys', 'NewErah', 'DeckTheBand',
 'Denny B', 'Steve JoHHbs', 'Benjaminimal', 'Bree my', 'Indigo Bill',
 'Throneaeon', 'The Attery Squash', 'Ollie', 'Tonner', 'West End Girls',
 'AngusBrown', 'Faraje', 'Sin  Ri-Ra', 'Pete Brown & Phil Ryan', 'Pip Skid',
 'JR & PH7', 'The Royals (Doo-Wop)', 'LzFromDaE']
)