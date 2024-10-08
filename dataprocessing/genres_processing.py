import pandas as pd
import numpy as np
import ast

attributes = ['popularity', 'danceability', 'energy', 'key', 'speechiness', 'acousticness', 'instrumentalness', 'valence', 'tempo']


def get_total_genre_keyword():
    df = pd.read_csv('./data/final_data.csv')
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

        for attribute in attributes:
            # Identify the most frequent range
            bins = pd.cut(df[df['tag'] == genre][attribute], bins=100)
            most_common_bin = bins.value_counts().idxmax()

            # Filter the DataFrame to include only values in the most frequent bin
            filtered_df = df[(df['tag'] == genre) & (df[attribute].between(most_common_bin.left, most_common_bin.right))]
            # if the attribute is an integer, round the value to the nearest integer
            if filtered_df[attribute].dtype == 'int64':
                value = round(filtered_df[attribute].mean())
            elif attribute == 'key':
                value = int(filtered_df[attribute].mode())
            else:
                value = filtered_df[attribute].mean()
            genre_values.append(value)

        genres2.append(genre)  # Add the genre to the list

    #add the average values to the dataframe
    genre_attribute_df['Genre'] = genres2
    for i in range(len(attributes)):
        genre_attribute_df[attributes[i]] = genre_values[i::len(attributes)]
    
    #save the dataframe to a csv file
    genre_attribute_df.to_csv('./data/genre_all_time_attribute.csv')

# function to create a file for each genre with the mode value of each attribute divided by 10 year periods from 1960 to 2022
def get_genre_time_attributes():
    df = pd.read_csv('./data/final_data.csv')

    # Cycle through each genre
    for genre in df['tag'].unique().tolist():
        # Create a DataFrame to store the median values of each attribute for each 10-year period
        genre_attribute_df = pd.DataFrame(columns=['Attribute'] + [f'{i}-{i+9}' for i in range(1963, 2022, 10)])
                
        # Calculate the median or mode value of each attribute for each 10-year period
        for attribute in attributes:
            values = [attribute]
            for i in range(1963, 2022, 10):
                period_df = df[(df['tag'] == genre) & (df['year'] >= i) & (df['year'] <= i+9)]
                
                # Identify the most frequent range
                bins = pd.cut(period_df[attribute], bins=100)
                most_common_bin = bins.value_counts().idxmax()
                
                # Filter the DataFrame to include only values in the most frequent bin
                filtered_df = period_df[period_df[attribute].between(most_common_bin.left, most_common_bin.right)]
                if filtered_df[attribute].dtype == 'int64':
                    value = round(filtered_df[attribute].median())
                elif attribute == 'key':
                    value = int(filtered_df[attribute].mode())
                else:
                    value = filtered_df[attribute].median()
               
                values.append(value)
            genre_attribute_df.loc[len(genre_attribute_df)] = values



def create_genre_files():
    genre_keyword_df = get_total_genre_keyword()
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

# function to create a file that creates a table with a column for each year and a row for each genre wwith the average value of popularity for each genre in that year
def create_popul_time_table():
    df = pd.read_csv('./data/final_data.csv')
    # Get the unique genres
    genres = df['tag'].unique().tolist()
    # Create a dictionary to store the average popularity values
    genre_popularity_dict = {genre: [] for genre in genres}

    # Iterate through the years
    for year in range(1960, 2022):
        # Iterate through the genres
        for genre in genres:
            # Get all the songs for that genre in that year
            songs = df[(df['tag'] == genre) & (df['year'] == year)]

            #  remove any row that has the value 0.0 or 0 in the popularity column
            songs = songs[songs['popularity'] != 0]

            # Get the average popularity for that genre in that year
            if not songs.empty:
                value = round(songs['popularity'].mean(), 1)
            else:
                value = 0
            # Append the value to the corresponding genre list
            genre_popularity_dict[genre].append(value)

    # Convert the dictionary to a DataFrame
    genre_popularity_df = pd.DataFrame(genre_popularity_dict, index=range(1960, 2022)).transpose()
    genre_popularity_df.index.name = 'Genre'

    # Save the DataFrame to a CSV file
    genre_popularity_df.to_csv('./data/genre_popularity_time.csv')

# Call the function to create the table
create_popul_time_table()