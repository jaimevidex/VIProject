import pandas as pd
import numpy as np
import yake

def extract_keywords(lyrics):
   language = "en"
   max_ngram_size = 1
   deduplication_threshold = 0.9
   deduplication_algo = 'seqm'
   windowSize = 1
   numOfKeywords = 25
   custom_kw_extractor = yake.KeywordExtractor(lan=language, n=max_ngram_size, dedupLim=deduplication_threshold, dedupFunc=deduplication_algo, windowsSize=windowSize, top=numOfKeywords, features=None)
   keywords = custom_kw_extractor.extract_keywords(lyrics)
   return np.array(keywords)

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    return df.assign(
        keywords=lambda x : x['lyrics'].apply(extract_keywords)
        )

# Step 3: Pipeline Function
def data_pipeline(df_main: pd.DataFrame, df_lyrics: pd.DataFrame) -> pd.DataFrame:
    # Create features in the secondary DataFrame (df_lyrics)
    df_lyrics = create_features(df_lyrics)
    
    # Drop the 'lyrics' column after feature extraction
    df_lyrics = df_lyrics.drop(['lyrics'], axis=1)
    
    # Merge the main DataFrame and the DataFrame with keywords based on common columns
    merged_df = pd.merge(df_main, df_lyrics, left_on=['song', 'artist'], right_on=['title', 'artist'])
    
    # Drop redundant columns after the merge
    merged_df = merged_df.drop(columns=['title'])
    
    return merged_df

# Example usage
df_main = pd.read_csv('./data/no_dups_data.csv')   # DataFrame with 'song' and 'artist' columns
df_lyrics = pd.read_json('./data/dataset1.json')  # DataFrame with 'title', 'artist', 'lyrics' columns

final_df = data_pipeline(df_main, df_lyrics)

# Inspect the final result
print(final_df.head())