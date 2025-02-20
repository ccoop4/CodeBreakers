# CodeBreakers
Pitch
- Codenames is a competitive common party game which now has a free web version. In the spirit of competition, CodeBreakers aim to test the limits of human creativity and pit players, voluntarily, against a fierce machine. Who will come out on top?

Functionality
- Users can enter a set of words and receive a word back which relates to the set
- Users can select how many of the given words should the returned word relate to or choose to have the model give them the highest amount possible
- Users will have their past entries saved as local website data to see more personalized recommendations/history
- Users can change to dark mode

Alternatives/Motivation
- No commercially available alternatives exists
- Our motivation was to create a tool that would allow us to beat our friends and family when playing the game

Technical Architecture

<img width="768" alt="Screen Shot 2023-12-03 at 4 48 06 PM" src="https://github.com/CS222-UIUC-FA23/group-project-team89/assets/46056355/3d4d21c8-9e21-4805-a8ac-d5ad7d693262">

- Flask backend and React frontend
- React frontend is written in HTML/JavaScript/CSS, provides an aesthetically pleasing interface for the user to enter words that are passed to the backend
- Flask backend is written in Python, retrieves the words entered by the users, queries the words against a GloVe Twitter vector database, and returns the most similar match to the frontend
- GloVe's Twitter vector database is based on words from 2 billion tweets
- Backend was primarily developed by Faizi, Charles, Eric
- Frontend was primarily devleoped by Faizi, Abhay

Reproducible Installation Instructions
- Clone the repository 
- Download the word vector dataset [here](https://drive.google.com/file/d/1LU1u6uEO2M8OdiOJuzJXm5apH7WQcIxY/view?usp=sharing) and drag it into the project folder
- In the project folder, run `npm i` to install all of the necessary packages for the React frontend
- Drag `working-dataset.d2v`, the word vector dataset (`working-dataset.d2v.vectors.npy`) and `requirements.txt` into the `api\venv` folder
- `cd api` and run `virtualenv venv`
- Run `venv\Scripts\activate` if on Windows or `venv\bin\activate` if on a Unix machine
- After the virtual machine has started `cd venv` and run `pip install -r requirements.txt`
- Run `flask run` to start the flask backend
- In another terminal, run `npm run dev` in the main project folder
- Open http://localhost:3000/ (Might take a few minutes to load at first)

Group Members and Roles
- Faizi Tofighi (faizimt2) - Backend, Frontend
- Charles Cooper (ccoop4) - Backend
- Abhay Benoy (abhayb2) - Frontend
- Eric Zhu (ericz5) - Backend
