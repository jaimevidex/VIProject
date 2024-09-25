import pandas as pd
import ast

def clean_keywords(df: pd.DataFrame) -> pd.DataFrame:
    # Convert keywords from string to actual list if they are stored as strings
    df['keywords'] = df['keywords'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    # Make all keywords lowercase
    df['keywords'] = df['keywords'].apply(lambda x: [k.lower() for k in x])
    
    # Iterate through the dataframe rows
    for i in range(len(df)):
        # Split artist name by spaces and lowercase the artist name
        artist = df.at[i, 'artist'].lower().split()
        
        # Remove keywords that exactly match any part of the artist name
        df.at[i, 'keywords'] = [keyword for keyword in df.at[i, 'keywords'] if keyword not in artist]


    #remove these exact words from keywords
    remove_words = ['hook','ugh','bout','gotta', 'uh', "oh", 'ah', 'eh', 'yeah','produced','feat','verse', 'chorus', 'intro', 'outro', 'bridge', 'instrumental', 'tha', 'huh', 'ima', 'ayy', 'nt', 'ohh', 'uhoh', 'uhohh', 'lil', 'jayz', 'yall', 'ysl', 'hey', 'heyy', 'aww', 'uhh' ]
    for i in range(len(df)):
        df.at[i, 'keywords'] = [keyword for keyword in df.at[i, 'keywords'] if keyword not in remove_words]

    return df

#read data file
df = pd.read_csv('./data/final_data.csv')

#clean keywords
df = clean_keywords(df)

#remove any rows that have less than 5 keywords
df = df[df['keywords'].apply(len) >= 5]

#drop release date column
df = df.drop(columns=['release_date'])

#save cleaned data
df.to_csv('./data/final_data.csv', index=False)

#print the minimum keyword array length
print(df['keywords'].apply(len).min())
#print the maximum keyword array length
print(df['keywords'].apply(len).max())
#print the array of distinct tags
print(df['tag'].explode().unique())

# print he minimum year of songs in the dataset
print(df['year'].min())
# print the maximum year of songs in the dataset
print(df['year'].max())
#print howw many songs are from <2000
print(len(df[df['year'] > 2021]))