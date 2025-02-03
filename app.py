from flask import Flask, render_template, request, jsonify
import pandas as pd
import requests
import markdown2
from io import StringIO
import os

app = Flask(__name__)

CSV_URL = "https://metabase.interviewbit.com/public/question/a408335b-14ff-47dd-9a31-74072fccfe7c.csv"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_feedback', methods=['POST'])
def get_feedback():
    email = request.json.get('email')
    
    # Fetch CSV data
    response = requests.get(CSV_URL)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch CSV data'}), 500
    
    # Read CSV into pandas DataFrame
    df = pd.read_csv(StringIO(response.text))
    
    # Find matching email
    matching_row = df[df['Email'] == email]
    
    if matching_row.empty:
        return jsonify({'error': 'Email not found'}), 404
    
    # Get feedback and convert to HTML
    feedback = matching_row.iloc[0]['Feedback']
    feedback_html = markdown2.markdown(feedback)
    
    return jsonify({'feedback_html': feedback_html})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
