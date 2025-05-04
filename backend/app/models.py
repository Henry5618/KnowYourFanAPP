from . import db
import json

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String(200))
    cpf = db.Column(db.String(14), unique=True, nullable=False)

    interests = db.Column(db.Text)
    activities = db.Column(db.Text)
    events_attended = db.Column(db.Text)
    purchases = db.Column(db.Text)

    id_document_path = db.Column(db.String(255), nullable=True)
    id_validation_status = db.Column(db.String(50), default='pending', nullable=True)
    social_media_links = db.Column(db.Text, nullable=True)
    social_media_analysis = db.Column(db.Text, nullable=True)
    esports_profile_links = db.Column(db.Text, nullable=True)
    profile_relevance_analysis = db.Column(db.Text, nullable=True)

    def to_dict(self):
        def safe_json_loads(text_data, default_value):
            if not text_data:
                return default_value
            try:
                return json.loads(text_data)
            except json.JSONDecodeError:
                print(f"Warning: Failed to decode JSON for user {self.id}: {text_data[:100]}...")
                return default_value

        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'address': self.address,
            'cpf': self.cpf,
            'interests': safe_json_loads(self.interests, []),
            'activities': self.activities,
            'events_attended': safe_json_loads(self.events_attended, []),
            'purchases': safe_json_loads(self.purchases, []),
            'id_document_path': self.id_document_path,
            'id_validation_status': self.id_validation_status,
            'social_media_links': safe_json_loads(self.social_media_links, {}),
            'social_media_analysis': safe_json_loads(self.social_media_analysis, {}),
            'esports_profile_links': safe_json_loads(self.esports_profile_links, {}),
            'profile_relevance_analysis': safe_json_loads(self.profile_relevance_analysis, {})
        }

    def __repr__(self):
        return f'<User {self.id} - {self.name} ({self.cpf}) ({self.email})>'