from fastapi import FastAPI
from transformers import pipeline 

app = FastAPI()

pipe = pipeline("text-classification", model="badmatr11x/distilroberta-base-offensive-hateful-speech-text-multiclassification", device=-1)

@app.get('/check')
async def search(s: str):
    res = pipe(s)

    if res[0]["label"] == "OFFENSIVE-LANGUAGE" or res[0]["label"] == "HATE-SPEECH":
        return {'offensive': True}

    return {'offensive': False}