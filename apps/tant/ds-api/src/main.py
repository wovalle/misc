from fastapi import FastAPI, HTTPException
from core.config import settings
from typing import List, Dict
import requests
import os
from process_embeddings import process
from env import assert_required_env_vars


assert_required_env_vars()

app = FastAPI(title=settings.PROJECT_NAME,version=settings.PROJECT_VERSION)
# TODO: read from env
presigned_url = ''
destination = 'downloads'


@app.get("/")
def read_root():
    
    response = requests.get(presigned_url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Open the file in binary write mode and write the content of the response
        with open(destination, 'wb') as f:
            f.write(response.content)
        print('File downloaded successfully')
    else:
        print('Failed to download file:', response.status_code)


    return {"Hello": "World"}


# TODO: download all files in parallel
@app.post("/embeddings")
async def process_embeddings(data: List[Dict[str, str]]):
    for item in data:
        if not all(key in item for key in ["presigned_url", "fileid", "start", "end"]):
            raise HTTPException(status_code=400, detail="Invalid data format")

        # Process each item in the list
        presigned_url = item["presigned_url"]
        start = int(item["start"])
        end = int(item["end"])
        fileid = item["fileid"]

        file_save_path = f"{destination}/{fileid}"

        print (f"Processing {fileid} from {start} to {end}")

         # Check if the file already exists
        if os.path.exists(file_save_path):
            print(f"File '{file_save_path}' already exists.")
        
        else:
            print (f"Downloading {presigned_url} to {fileid}")

            response = requests.get(presigned_url)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Open the file in binary write mode and write the content of the response
                with open(file_save_path, 'wb') as f:
                    f.write(response.content)

                print(f'File {fileid} downloaded successfully')
            else:
                print('Failed to download file:', response.status_code)
                raise HTTPException(status_code=400, detail=f"Failed to download file {fileid}")

        
        # Now that we already have the file downloaded, we can process it
        print(f"Processing {fileid} from {start} to {end}")
        process(file_save_path, start, end)



        
    return {"message": f"Data for fileid {fileid} processed successfully"}