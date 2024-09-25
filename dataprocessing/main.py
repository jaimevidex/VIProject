import pandas as pd
import ast
from genres_processing import create_genre_files

def merge_data_sources():
  df_main = pd.read_csv('./data/no_dups_data.csv')   # DataFrame with 'song' and 'artist' columns
  df_lyrics = pd.read_json('./data/dataset1.json')
  merged_df = pd.merge(df_main, df_lyrics, left_on=['title', 'artist'], right_on=['title', 'artist'])
    
  # Drop redundant columns after the merge
  merged_df = merged_df.drop(columns=['time_signature', 'language', 'release_date', 'liveness', 'loudness'])
  merged_df.to_csv('./data/final_data.csv', index=False)

def clean_dataset():
    df = pd.read_csv('./data/final_data.csv')
    
    # Convert keywords from string to actual list if they are stored as strings
    def safe_literal_eval(val):
        try:
            return ast.literal_eval(val)
        except (ValueError, SyntaxError):
            return val.split() if isinstance(val, str) else val
    
    df['keywords'] = df['keywords'].apply(safe_literal_eval)
    
    # Make all keywords lowercase
    df['keywords'] = df['keywords'].apply(lambda x: [k.lower() for k in x])
    
    remove_words = ['yuh','youryour','cuz','ooh','bah','woo','mmmmmhm','hmm','prechorus','hook','ugh','bout','gotta', 'uh', "oh", 'ah', 'eh', 'yeah','produced','feat','verse', 'chorus', 'intro', 'outro', 'bridge', 'instrumental', 'tha', 'huh', 'ima', 'ayy', 'nt', 'ohh', 'uhoh', 'uhohh', 'lil', 'jayz', 'yall', 'ysl', 'hey', 'heyy', 'aww', 'uhh' ]

    # Iterate through the dataframe rows
    for i in range(len(df)):
        # Split artist name by spaces and lowercase the artist name
        artist = df.at[i, 'artist'].lower().split()
        
        # Remove keywords that exactly match any part of the artist name
        df.at[i, 'keywords'] = [keyword for keyword in df.at[i, 'keywords'] if keyword not in artist]
    
        # Remove keywords that are in the remove_words list
        df.at[i, 'keywords'] = [keyword for keyword in df.at[i, 'keywords'] if keyword not in remove_words]

    # Remove any rows that have less than 5 keywords
    df = df[df['keywords'].apply(len) >= 5]

    # Remove any rows that have misc as a tag
    df = df[df['tag'] != 'misc']

    # Convert the 'keywords' column to a string to handle unhashable type
    df['keywords_str'] = df['keywords'].apply(lambda x: ' '.join(x) if isinstance(x, list) else x)
    
    # Drop duplicates based on a subset of columns including the string representation of keywords
    df = df.drop_duplicates(subset=['title', 'artist', 'year', 'tag', 'keywords_str'])
    
    # Remove the temporary 'keywords_str' column
    df = df.drop(columns=['keywords_str'])

    # Remove any tracks that have the same title and artist combination
    df = df.drop_duplicates(subset=['title', 'artist'])

    # Save cleaned data
    df.to_csv('./data/final_data.csv', index=False)


if __name__ == "__main__":
    print('Starting merge')
    merge_data_sources()
    print('Data sources merged')
    
    print('Starting cleaning')
    clean_dataset()
    print('Data cleaned')
    
    print('Creating genre files')
    create_genre_files()
    print('Genre files created')


