import gensim.downloader as api
from gensim.models import KeyedVectors
import itertools
from functools import cmp_to_key
from datetime import datetime
import json

def func(good_words):
    print(good_words)
    startTime = datetime.now()
    results = []
    removed_words = []

    message = "all good"

    # Load word vector dataset
    model = KeyedVectors.load("working-dataset.d2v")
    print("Time to load model:", datetime.now() - startTime)

    for word in good_words:
        if word not in model:
            good_words.remove(word)
            removed_words.append(word)
            print("Removed word: ", word)

    if len(good_words) < 2:
        message = "Word array not long enough"
     
    for j in range(2, 6):
            combinations = itertools.combinations(good_words, j)
            for combination in combinations:
                for result in model.most_similar(positive=list(combination)):
                    if result[1] > 0.6:
                        # words = ' '.join(combination)
                        # results.append([words, result])
                        results.append((combination, result))
    def compare(result1, result2):
        return 10 * (result2[1][1] - result1[1][1])
    if len(result) == 0:
        message = "No good clues found for data set"
    results = sorted(results, key=cmp_to_key(compare))
    results = results[:10]
    # print(results)
    print("Program exited in", datetime.now() - startTime)
    return {"result" : results, "removed_words" : removed_words, "error" : message }