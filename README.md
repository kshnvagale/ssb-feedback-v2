# Feedback Lookup Application

A web application that allows users to look up feedback by email address. The application fetches data from a CSV file and displays the feedback in a beautifully formatted markdown style.

## Features

- Email-based feedback lookup
- Dark/Light mode toggle
- Markdown rendering of feedback
- Responsive design
- Error handling

## Deployment on Render

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click on "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: Choose a name for your service
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Select the appropriate instance type

The application will be automatically deployed and available at your Render URL.

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

The application will be available at `http://localhost:5002`
