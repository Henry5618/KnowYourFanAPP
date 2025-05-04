from flask import current_app, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import json
from . import db
from .models import User
from .services import user_service, ai_simulation

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@current_app.route('/api/users', methods=['POST'])
def handle_user_data():
    data = request.get_json()
    if not data or not data.get('cpf'):
        return jsonify({"error": "CPF é obrigatório"}), 400

    user, error, status_code = user_service.create_or_update_user(data)

    if error:
        return jsonify(error), status_code
    if user:
        return jsonify(user.to_dict()), status_code
    else:
        return jsonify({"error": "Não foi possível processar o usuário"}), 500

@current_app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = user_service.get_user_by_id(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({"error": "Usuário não encontrado"}), 404

@current_app.route('/api/users/<int:user_id>/upload_id', methods=['POST'])
def upload_id_document(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    if 'id_document' not in request.files:
        return jsonify({"error": "Campo 'id_document' ausente na requisição"}), 400
    file = request.files['id_document']
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(f"user_{user_id}_id_{file.filename}")
        upload_dir = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)

        if not os.access(os.path.dirname(filepath), os.W_OK):
            return jsonify({"error": f"Sem permissão de escrita no diretório: {os.path.dirname(filepath)}"}), 500

        try:
            file.save(filepath)

            try:
                user.id_document_path = filepath
                user.id_validation_status = 'pending'
                db.session.commit()
                return jsonify({"message": "Documento recebido.", "filename": filename}), 200
            except Exception as db_err:
                db.session.rollback()
                if os.path.exists(filepath):
                    os.remove(filepath)
                return jsonify({"error": f"Erro ao salvar caminho no banco de dados: {str(db_err)}"}), 500

        except Exception as save_err:
            return jsonify({"error": f"Erro ao salvar o arquivo no disco: {str(save_err)}"}), 500
    else:
        return jsonify({"error": f"Tipo de arquivo não permitido."}), 400

@current_app.route('/api/users/<int:user_id>/validate_id', methods=['POST'])
def validate_id(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user: return jsonify({"error": "Usuário não encontrado"}), 404
    if not user.id_document_path or not os.path.exists(user.id_document_path):
        return jsonify({"error": "Documento não encontrado"}), 400

    validation_result = ai_simulation.simulate_id_validation(user.id_document_path)
    user.id_validation_status = validation_result.get("status", "error")
    try:
        db.session.commit()
        return jsonify(validation_result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro DB ao salvar status: {e}"}), 500

@current_app.route('/api/users/<int:user_id>/link_social', methods=['POST'])
def link_social_media(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user: return jsonify({"error": "Usuário não encontrado"}), 404
    data = request.get_json()
    if not data or 'social_media' not in data or not isinstance(data['social_media'], dict):
        return jsonify({"error": "Dados inválidos"}), 400
    try:
        valid_links = {k: v for k, v in data['social_media'].items() if v and isinstance(v, str) and v.strip()}
        user.social_media_links = json.dumps(valid_links)
        user.social_media_analysis = None
        db.session.commit()
        return jsonify({"message": "Links sociais salvos.", "links": valid_links}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro DB ao salvar links: {e}"}), 500

@current_app.route('/api/users/<int:user_id>/analyze_social', methods=['POST'])
def analyze_social_media(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user: return jsonify({"error": "Usuário não encontrado"}), 404
    if not user.social_media_links: return jsonify({"error": "Nenhum link vinculado"}), 400
    try:
        social_links = json.loads(user.social_media_links)
        if not social_links: return jsonify({"error": "Nenhum link válido vinculado"}), 400
        analysis_result = ai_simulation.simulate_social_media_analysis(social_links)
        user.social_media_analysis = json.dumps(analysis_result)
        db.session.commit()
        return jsonify(analysis_result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro interno na análise social: {e}"}), 500

@current_app.route('/api/users/<int:user_id>/link_profile', methods=['POST'])
def link_esports_profile(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user: return jsonify({"error": "Usuário não encontrado"}), 404
    data = request.get_json()
    if not data or 'esports_profiles' not in data or not isinstance(data['esports_profiles'], dict):
        return jsonify({"error": "Dados inválidos"}), 400
    try:
        valid_profiles = {k: v for k, v in data['esports_profiles'].items() if v and isinstance(v, str) and v.strip()}
        user.esports_profile_links = json.dumps(valid_profiles)
        user.profile_relevance_analysis = None
        db.session.commit()
        return jsonify({"message": "Links de perfis salvos.", "links": valid_profiles}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro DB ao salvar perfis: {e}"}), 500

@current_app.route('/api/users/<int:user_id>/validate_profile', methods=['POST'])
def validate_esports_profile(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user: return jsonify({"error": "Usuário não encontrado"}), 404
    if not user.esports_profile_links: return jsonify({"error": "Nenhum link vinculado"}), 400
    try:
        profile_links = json.loads(user.esports_profile_links)
        if not profile_links: return jsonify({"error": "Nenhum link válido vinculado"}), 400
        user_interests = json.loads(user.interests or '[]')
        analysis_result = ai_simulation.simulate_profile_relevance_analysis(profile_links, user_interests)
        user.profile_relevance_analysis = json.dumps(analysis_result)
        db.session.commit()
        return jsonify(analysis_result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erro interno na validação de perfil: {e}"}), 500

@current_app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    upload_dir = current_app.config['UPLOAD_FOLDER']
    safe_path = os.path.abspath(os.path.join(upload_dir, filename))
    if not safe_path.startswith(os.path.abspath(upload_dir)):
        return jsonify({"error": "Acesso inválido"}), 403
    if not os.path.isfile(safe_path):
        return jsonify({"error": "Arquivo não encontrado"}), 404
    return send_from_directory(upload_dir, filename)

@current_app.route('/api/health')
def health_check():
    return jsonify({"status": "API is running"}), 200
