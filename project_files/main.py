from flask import Flask
import query
#app = Flask(__name__)

#@app.route('/')
def main():
    #add function to webscrape words
    #words = webscrape.main()
    #query words
    #data, combination_vectors = query.main() 
    #return data

    
    good_words_ = ["trip", "concert", "leather", "trunk", "flat", "bar", "mother"]
    
    # Tests where "Answer" will be the final output, need to transfer while organizing our implementation from query later
    answer = ""

    # Test 1, word not in the input list of words
    assert(answer not in good_words_)

    # Test 2, word is not obscure (measured by word length)
    too_long = 10
    assert(len(answer) < too_long)

    #Test 3, word is a distinctive
    common_words = ["a", "I", "the", "on", "in", "into"] # need to add more words or find a list online later
    assert(answer not in common_words)
    return

if __name__ == '__main__':
    #app.run(debug=True)
    main()