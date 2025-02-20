import io
import re
import time
import numpy as np
import pandas as pd
import itertools
import copy

# To keep track of how long the program runs
start_time = time.time()

# To see all results in terminal upon function completion
pd.set_option('display.max_columns', None)  

# Function to load the word vectors
def load_vectors(fname, g):
    # Want to make a deep copy of the passed good words array so we can delete words from good_words without affecting
    # the original array.
    good_words = copy.deepcopy(g)
    fin = io.open(fname, 'r', encoding='utf-8', newline='\n', errors='ignore')
    # We don't need to read the first line
    n, d = map(int, fin.readline().split())
    # Make a dataframe in which we will put the best clue for every combination of vectors
    combination_vectors = pd.DataFrame()
    combination_vectors.index = ["num_words", "avg_vector", "best_word", "diff"]
    # Get every combination of good_words between 2 and 6 words, since it's not useful to give clues for one word
    # and not feasible for any combination of more than 6 words. 
    for j in range(2, 6):
        combinations = list(itertools.combinations(good_words, j))
        for combination in combinations:
            # populate the combination vectors dataframe
            combination_vectors[combination] = [j, np.zeros(300), "", 10000]
    data = {}
    # counter to keep track of how many words we've looked through
    i = 1
    for line in fin:
        tokens = line.rstrip().split(' ')
        if not re.search('[a-zA-Z]', tokens[0]):
            continue
        # word vector of entry
        values = list(map(float, tokens[1:]))
        # if we haven't found all the words in the database yet, then set the word to its vector in the DB
        # this is so that the best possible case of searching the vector database is close to O(n), n = # entries
        if good_words:
            data[tokens[0]] = values
        # if the current word is one of the given words
        if tokens[0] in good_words:
            # if the combination contains the word, add it to the avg vector value, and divide by number of words in the combination
            # For example: Let good_words be ["apple", "pear", "orange"]. 
            # When "apple" is found in the word vector database, add its corresponding vector to every entry in the 
            # combination_vectors dataframe and divide by the number of words in that combination.
            # Ex. for ["apple", "pear"] and ["apple", "orange"] add the "apple" vector divided by 2,
            # but don't add that vector to the ["pear", "orange"] combination.
            # this allows us to find the avg word vector of every combination of words quickly.
            for col in combination_vectors:
                if tokens[0] in col:
                    combination_vectors[col]["avg_vector"] = np.add(combination_vectors[col]["avg_vector"], np.divide(values, combination_vectors[col]["num_words"]))
            print("Word found: " + tokens[0])
            # remove the word from good_words, so that when all good_words are found we don't have to go through the entire vector database again
            # we can just search the remaining words for similarity to any of the combinations
            good_words.remove(tokens[0])
        # when all words have been found
        if not good_words:
            # compare every word in the vector database to every combination of words in the combination_vectors DF
            # and find the one with the lowest diff to each combination
            for col in combination_vectors:
                temp_diff = 0
                if any(tokens[0] in word for word in col) or any(word in tokens[0] for word in col) or tokens[0] in col:
                    continue
                temp_diff = np.sum(np.abs(combination_vectors[col]["avg_vector"] - values))
                # if current word vector is closer to avgs of word vectors of every word in the combination,
                # update that in the DF
                if temp_diff < combination_vectors[col]["diff"]:
                    combination_vectors[col]["diff"] = temp_diff
                    combination_vectors[col]["best_word"] = tokens[0]
        i+=1
        # stop after 500,000 words so the program doesn't take too long
        if i == 500000: break
    return data, combination_vectors

good_words_ = ["trip", "concert", "leather", "trunk", "flat", "bar", "mother"]

avg = [0] * 300
# load data and combination vectors
data, combination_vectors = load_vectors("1m-word-vector-database.vec", good_words_)
df = pd.DataFrame(data)

# search through the initial words (the entries in the vector DB before all the words in good_words were found)
# for best matches 
for token in df:
    for col in combination_vectors:
        temp_diff = 0
        if any(token in word for word in col) or any(word in token for word in col) or token in col:
            continue
        temp_diff = np.sum(np.abs(combination_vectors[col]["avg_vector"] - df[token]))
        if temp_diff < combination_vectors[col]["diff"]:
            combination_vectors[col]["diff"] = temp_diff
            combination_vectors[col]["best_word"] = token

# finally, print the best possible clues for each combination of words
print(combination_vectors.loc[["best_word"]])
# amount of time taken to read vectors
read_time = time.time() - start_time
print("Time to load vectors:")
print(str(read_time) + "s")

# Other code that experiments with putting word vector database in an hdf5 file (fastest known read/write filetype)
# and old code for searching thru vector DB


# with h5py.File("data.hdf5", "w") as f:
#     dset = f.create_dataset("dataset", data=df)

# f = h5py.File('data.hdf5', 'r')

# print(f.keys())

# print("Num words in dataset:")
# print(df.shape[1])
# avg = [x/len(good_words) for x in avg]
# diff = 1000000
# final_word = ""
# for word in df:
#     temp_diff = 0
#     if any(word in good_word for good_word in good_words) or any(good_word in word for good_word in good_words) or word in good_words:
#         continue
#     for index, val in enumerate(df[word]):
#         temp_diff += abs(avg[index] - val)
#     if temp_diff < diff:
#         diff = temp_diff
#         final_word = word
# print("Clue: " + final_word)



# Time taken to run program and quit
print("Program exited in: ")
print(str(time.time() - start_time) + "s")
quit()