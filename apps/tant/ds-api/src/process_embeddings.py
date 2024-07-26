from env import get_var
from pyannote.audio import Model


# https://colab.research.google.com/drive/1s-IxiDNYuZiDomRbTEErlt6TxgBJjQcc#scrollTo=9_tBl3lqED1G
def process(filepath, start, end):
    print(f"Processing embeddings for {filepath} from {start} to {end}")
    
    hugging_face_token = get_var('HUGGING_FACE_TOKEN')
    print (f"Using Hugging Face token: {hugging_face_token}")

    model = Model.from_pretrained("pyannote/embedding", use_auth_token=hugging_face_token)

    




    return []