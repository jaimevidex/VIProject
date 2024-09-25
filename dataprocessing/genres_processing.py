import pandas as pd
import numpy as np
import ast

# function to get the top 20 keywords for each genre divided by 10 year periods from 1960 to 2022
def get_top_keyword_genre():
    df = pd.read_csv('./data/final_data.csv')
    # create dataframe to store the top keywords array for each genre in 10 year periods (columns represent the years and rows represent the genres)
    top_keywords_df = pd.DataFrame()

    #cycle throught years in 10 year increments
    for i in range(1960, 2022, 10):
      #get the genre keyword dataframe for the 10 year period
      genre_keyword_df = get_genre_keyword(df, i, i+9)

      # create an array for each genre with the top 20 keywords
      top_keywords = []
      genres = []  # List to store the genres

      #save the order in which the genres appear
      for genre in genre_keyword_df.columns:
          # Sort the DataFrame by the values in the genre column, descending
          sorted_df = genre_keyword_df[[genre]].sort_values(by=genre, ascending=False)
          # Remove any row that has the value 0.0 or 0 in the genre column
          filtered_df = sorted_df[sorted_df[genre] != 0]
          # Get the top 20 keywords
          top_keywords.append(filtered_df.head(20).index.tolist())
          genres.append(genre)  # Add the genre to the list

      # put it in the top_keywords_df dataframe in the correct column corresponding to the 10 year period
      top_keywords_df[f'{i}-{i+9}'] = top_keywords

    # Add the genres as the first column
    top_keywords_df.insert(0, 'Genre', genres)
    top_keywords_df.to_csv('./data/top_keywords.csv', index=False)

# function to count how many times each individual word in the keyword array appears in each different genre for a scpecified time period
def get_genre_keyword(df: pd.DataFrame, start_year: int, end_year: int) -> pd.DataFrame:
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
        if row['year'] < start_year or row['year'] > end_year:
            continue
        for word in keywords:
            if word in genre_keyword_dict[genre]:
                genre_keyword_dict[genre][word] += 1
            else:
                genre_keyword_dict[genre][word] = 1

    genre_keyword_df = pd.DataFrame(genre_keyword_dict)
    genre_keyword_df = genre_keyword_df.fillna(0)

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

    return genre_keyword_df

# function to get the average value of music attributes for each genre
def get_total_atributes():
    df = pd.read_csv('./data/final_data.csv')
    #get the unique genres
    genres = df['tag'].unique().tolist()
    #create a dataframe to store the average value of each attribute for each genre
    genre_attribute_df = pd.DataFrame()

    genre_values = []
    genres2 = []  # List to store the genres
    #iterate through the genres
    for genre in genres:
        #get the mode value of popularity,danceability,energy,key,loudness,speechiness,acousticness,instrumentalness,liveness,valence,tempo for the genre
        popularity = df[df['tag'] == genre]['popularity'].mode().values[0]
        danceability = df[df['tag'] == genre]['danceability'].mode().values[0]
        energy = df[df['tag'] == genre]['energy'].mode().values[0]
        key = df[df['tag'] == genre]['key'].mode().values[0]
        loudness = df[df['tag'] == genre]['loudness'].mode().values[0]
        speechiness = df[df['tag'] == genre]['speechiness'].mode().values[0]
        acousticness = df[df['tag'] == genre]['acousticness'].mode().values[0]
        instrumentalness = df[df['tag'] == genre]['instrumentalness'].mean()
        liveness = df[df['tag'] == genre]['liveness'].mode().values[0]
        valence = df[df['tag'] == genre]['valence'].mode().values[0]
        tempo = df[df['tag'] == genre]['tempo'].mode().values[0]
        genre_values.append([popularity, danceability, energy, key, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo])

        genres2.append(genre)  # Add the genre to the list

    #add the average values to the dataframe
    genre_attribute_df['Genre'] = genres2
    genre_attribute_df['Popularity'] = [x[0] for x in genre_values]
    genre_attribute_df['Danceability'] = [x[1] for x in genre_values]
    genre_attribute_df['Energy'] = [x[2] for x in genre_values]
    genre_attribute_df['Key'] = [x[3] for x in genre_values]
    genre_attribute_df['Loudness'] = [x[4] for x in genre_values]
    genre_attribute_df['Speechiness'] = [x[5] for x in genre_values]
    genre_attribute_df['Acousticness'] = [x[6] for x in genre_values]
    genre_attribute_df['Instrumentalness'] = [x[7] for x in genre_values]
    genre_attribute_df['Liveness'] = [x[8] for x in genre_values]
    genre_attribute_df['Valence'] = [x[9] for x in genre_values]
    genre_attribute_df['Tempo'] = [x[10] for x in genre_values]
    
    #save the dataframe to a csv file
    genre_attribute_df.to_csv('./data/genre_all_time_attribute.csv')

# function to create a file for each genre with the mode value of each attribute divided by 10 year periods from 1960 to 2022
def get_genre_time_atributes():
    df = pd.read_csv('./data/final_data.csv')
    #create a dataframe to store the mode value of each attribute for each genre in 10 year periods (columns represent the years and rows represent the genres)
    genre_attribute_df = pd.DataFrame()

    #cycle throught years in 10 year increments
    for i in range(1960, 2022, 10):
        #get the mode value of each attribute for each genre in the 10 year period
        genre_values = []
        genres = []  # List to store the genres
        for genre in df['tag'].unique().tolist():
            popularity = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['popularity'].mode().values[0]
            danceability = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['danceability'].mode().values[0]
            energy = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['energy'].mode().values[0]
            key = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['key'].mode().values[0]
            loudness = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['loudness'].mode().values[0]
            speechiness = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['speechiness'].mode().values[0]
            acousticness = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['acousticness'].mode().values[0]
            instrumentalness = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['instrumentalness'].mean()
            liveness = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['liveness'].mode().values[0]
            valence = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['valence'].mode().values[0]
            tempo = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]['tempo'].mode().values[0]
            genre_values.append([popularity, danceability, energy, key, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo])

        #add the average values to the dataframe
        genre_attribute_df[f'{i}-{i+9}'] = [x for x in genre_values]
        genre_attribute_df.insert(0, 'Genre', genres)

    #save the dataframe to csv's files for each genre
    for genre in genre_attribute_df.columns:
        if genre == 'Genre':
            continue
        genre_attribute_df[[genre, 'Genre']].to_csv(f'./data/genre_attribute_{genre}.csv', index=False)
    

#get_top_keyword_genre()
#get_total_atributes()
get_genre_time_atributes()