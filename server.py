import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from groq import Groq
from datetime import datetime
from dotenv import load_dotenv

# 1. Setup Environment
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# 2. Initialize Flask & Database
app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interviews.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
client = Groq(api_key=GROQ_API_KEY)

# 3. Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

class InterviewSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True)
    track = db.Column(db.String(100))
    transcript = db.Column(db.Text, default="")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# 4. API Endpoints
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        user = User(name=data['name'], email=data['email'])
        db.session.add(user) # FIXED: added .session
        db.session.commit() # FIXED: added .session
    return jsonify({"id": user.id, "name": user.name, "email": user.email})

@app.route('/api/interview/start', methods=['POST'])
def start_interview():
    data = request.json
    # Check if session exists to avoid duplicates
    existing_session = InterviewSession.query.filter_by(session_id=data['sessionId']).first()
    if not existing_session:
        session = InterviewSession(session_id=data['sessionId'], track=data['track'])
        db.session.add(session) # FIXED: added .session
        db.session.commit() # FIXED: added .session
    
    prompt = f"You are a professional technical interviewer for a {data['track']} role. Start the interview by introducing yourself briefly and asking the first question."
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": prompt}]
        )
        return jsonify({"message": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/interview/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data.get('sessionId')
    user_message = data.get('message')
    
    session = InterviewSession.query.filter_by(session_id=session_id).first()
    if session:
        session.transcript += f"\nCandidate: {user_message}"
        db.session.commit() # FIXED: added .session

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Continue the technical interview professionally."},
                {"role": "user", "content": user_message}
            ]
        )
        ai_message = response.choices[0].message.content
        if session:
            session.transcript += f"\nInterviewer: {ai_message}"
            db.session.commit() # FIXED: added .session
        return jsonify({"message": ai_message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/feedback', methods=['POST']) # FIXED: Match the React URL
def get_feedback():
    data = request.json
    session = InterviewSession.query.filter_by(session_id=data['sessionId']).first()
    if not session:
        return jsonify({"error": "Session not found"}), 404

    feedback_prompt = f"Analyze this interview for {session.track}. Provide strengths and improvements:\n\n{session.transcript}"
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": feedback_prompt}]
        )
        return jsonify({"feedback": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)