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


# Example usage
df_lyrics = pd.read_json('./data/dataset1.json')
df_lyrics = create_features(df_lyrics)