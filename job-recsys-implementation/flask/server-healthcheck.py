import requests
import logging

# Configure logging to output to the console
logging.basicConfig(
    level=logging.INFO,  # Log level
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
    handlers=[logging.StreamHandler()]  # Log to console
)

def health_check():
    url = 'http://localhost:5000'  # Update if needed
    try:
        response = requests.get(url)
        if response.status_code == 200:
            logging.info(f"Health check succeeded: {response.text}")
        else:
            logging.warning(f"Unexpected status code: {response.status_code}, Response: {response.text}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Health check failed: {e}")

if __name__ == "__main__":
    health_check()
