from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd

app = FastAPI()

# Frontend connection permissions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Files load karein (Ensure these .pkl files are in the same folder)
try:
    music_df = pickle.load(open('music_list.pkl', 'rb'))
    cosine_mat = pickle.load(open('similarity.pkl', 'rb'))
    print("Models loaded successfully!")
except Exception as e:
    print(f"Error loading files: {e}")

@app.get("/recommend")
def get_recommend(song: str):
    try:
        
        # main.py ke andar ye line change karein
        idx = music_df[music_df['song'].str.strip().str.lower() == song.strip().lower()].index[0]
        
        # Similarity logic using cosine_mat
        distances = sorted(list(enumerate(cosine_mat[idx])), reverse=True, key=lambda x: x[1])
        
        recs = []
        for i in distances[1:6]:
            recs.append({
                "artist": music_df.iloc[i[0]].artist,
                "song": music_df.iloc[i[0]].song
            })
        return {"recommendations": recs}
    except Exception as e:
        return {"recommendations": [], "error": "Song not found in database"}