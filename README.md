# Feedback Lookup Application

A simple web application that allows users to look up feedback using their email address.

## Features
- Email-based feedback lookup
- Dark mode support
- Markdown rendering of feedback
- Responsive design

## Deployment on Render.com

1. Create a new account on [Render](https://render.com) if you haven't already
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository
4. Fill in the following details:
   - Name: `feedback-lookup` (or your preferred name)
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Click "Create Web Service"

The application will be automatically deployed and you'll get a URL where it's accessible.

## Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Visit `http://localhost:5000` in your browser
