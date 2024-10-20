import nltk
import certifi

# Set the NLTK data path
nltk.data.path.append("/Users/nabeel/Downloads/porter_test")

# Set the SSL certificate file
nltk.data.path.append(certifi.where())

# Download stopwords
nltk.download('stopwords')
