import pandas as pd
import numpy as np
import ast

# function to count how many times each individual word in the keyword array appears in each different genre
def get_genre_keyword(df: pd.DataFrame) -> pd.DataFrame:
    #get the unique genres
    genres = df['tag'].unique().tolist()

     # Convert keywords from string to actual list if they are stored as strings
    df['keywords'] = df['keywords'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    # cycle through the keywords and create a dictionary of the genres and the number of times each keyword appears in that genre
    genre_keyword_dict = {}
    # Initialize the dictionary with genres
    for genre in genres:
        genre_keyword_dict[genre] = {}

    # Iterate over the rows of the DataFrame
    for index, row in df.iterrows():
        genre = row['tag']
        keywords = row['keywords']
        if keywords is None:
            continue
        for word in keywords:
            if word in genre_keyword_dict[genre]:
                genre_keyword_dict[genre][word] += 1
            else:
                genre_keyword_dict[genre][word] = 1

    genre_keyword_df = pd.DataFrame(genre_keyword_dict)
    genre_keyword_df = genre_keyword_df.fillna(0)
    return genre_keyword_df


df = pd.read_csv('./data/final_data.csv')
genre_keyword_df = get_genre_keyword(df)

#for each genre, create a file with the keywords and the number of times they appear in that genre
for genre in genre_keyword_df.columns:
    
   # Change the title of the first column to 'keyword'
    genre_keyword_df.index.name = 'keyword'

    # Sort the DataFrame by the values in the genre column, descending
    sorted_df = genre_keyword_df[[genre]].sort_values(by=genre, ascending=False)

    # Remove any row that has the value 0.0 or 0 in the genre column
    filtered_df = sorted_df[sorted_df[genre] != 0]

    # Save the filtered DataFrame to a CSV file
    filtered_df.to_csv(f'./data/genre_keyword_{genre}.csv')

# create a table with how many times each keyword appears in total
genre_keyword_df['total'] = genre_keyword_df.sum(axis=1)

# Sort the DataFrame by the values in the 'total' column, descending
sorted_df = genre_keyword_df.sort_values(by='total', ascending=False)

# Save the sorted DataFrame to a CSV file
sorted_df.to_csv('./data/genre_keyword_total.csv')