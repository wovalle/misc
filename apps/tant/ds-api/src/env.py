import os

def assert_required_env_vars():
    required_env_vars = ["HUGGING_FACE_TOKEN"]

    # Check if the environment is not production
    if os.environ.get('ENVIRONMENT') != 'production':
        from dotenv import load_dotenv

        print("Loading environment variables from .env file")
        # Load environment variables from .env file
        load_dotenv()



    for env_var in required_env_vars:
        if env_var not in os.environ:
            raise EnvironmentError(f"{env_var} not found")

def get_var(var_name):
    return os.environ.get(var_name)