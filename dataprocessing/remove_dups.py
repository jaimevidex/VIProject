import pandas as pd
import numpy as np


def remove_dups():
    tracks = pd.read_csv('./data/data.csv')
    #remove coloumn index
    tracks = tracks.drop(["index"], axis=1)
    #drop duplicates
    tracks = tracks.drop_duplicates()
    #remove any tracks that have the same title and artist combination
    tracks = tracks.drop_duplicates(subset=['title', 'artist'])
    #save the new data csv
    tracks.to_csv('./data/no_dups_data.csv', index=False)

__name__ = "__main__"
remove_dups()