import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()
UPLOAD_FOLDER_NAME = 'uploads'

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    print(f"APP: Instance path: {app.instance_path}")

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback-dev-secret-key-change-me!')
    db_path = os.path.join(app.instance_path, 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    upload_dir = os.path.join(app.instance_path, UPLOAD_FOLDER_NAME)
    app.config['UPLOAD_FOLDER'] = upload_dir

    print(f"APP: Database path: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"APP: Upload folder path: {app.config['UPLOAD_FOLDER']}")

    try:
        os.makedirs(app.instance_path, exist_ok=True)
        os.makedirs(upload_dir, exist_ok=True)
        print("APP: Diretórios instance e uploads verificados/criados.")
    except OSError as e:
        print(f"APP: ERRO CRÍTICO ao criar diretórios instance/uploads: {e}")

    db.init_app(app)
    CORS(app)

    with app.app_context():
        from . import models
        from . import routes
        db.create_all()
        print("APP: Tabelas do banco de dados verificadas/criadas.")

    print("APP: Aplicação Flask criada e configurada.")
    return app