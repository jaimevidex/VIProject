import pandas as pd
import numpy as np

def get_artists(df: pd.DataFrame) -> list[int]:
    #get artists already in the dataset
    checked_artists = pd.read_csv('./data/no_dups_data.csv')['artist'].unique().tolist()
    #return artists that are not already in the dataset
    return [artist for artist in df['artist'].unique().tolist() if artist not in checked_artists]



# Example usage
df = pd.read_json('./data/dataset1.json')
artists = get_artists(df)
#get 300 random artists
artists = np.random.choice(artists, 300)
print(artists)