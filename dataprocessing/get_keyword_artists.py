import pandas as pd
import numpy as np
import ast

# Function to get the top 20 keywords for each artist
def get_top_artist_keywords(df: pd.DataFrame) -> pd.DataFrame:
   # get all the artists in the dataset
    artists = df['artist'].unique().tolist()

    # Convert keywords from string to actual list if they are stored as strings
    df['keywords'] = df['keywords'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    # cycle through the keywords and create a dictionary of the artists and the the top 20 keywords for each artist in an array
    artist_keyword_dict = {}

    # Initialize the dictionary with artists
    for artist in artists:
        artist_keyword_dict[artist] = []

    # Iterate over the rows of the DataFrame
    for index, row in df.iterrows():
        artist = row['artist']
        keywords = row['keywords']
        if keywords is None:
            continue
        for word in keywords:
            if word not in artist_keyword_dict[artist]:
                artist_keyword_dict[artist].append(word)


    # Iterate over the dictionary and keep only the top 20 keywords for each artist
    for artist in artist_keyword_dict:
        # the 20 keywords that appear the most
        artist_keyword_dict[artist] = sorted(artist_keyword_dict[artist], key=lambda x: artist_keyword_dict[artist].count(x), reverse=True)[:20]

    # Create a DataFrame from the dictionary
    artist_keyword_df = pd.DataFrame(artist_keyword_dict.items(), columns=['artist', 'keywords'])
    return artist_keyword_df



df = pd.read_csv('./data/final_data.csv')
artist_keyword_df = get_top_artist_keywords(df)

# save the artist_keyword_df to a csv file
artist_keyword_df.to_csv('./data/artist_keyword.csv')