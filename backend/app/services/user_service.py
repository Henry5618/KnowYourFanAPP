import json
import logging
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import User

logger = logging.getLogger("user_service")

def create_or_update_user(data):
    cpf = data.get('cpf')
    if not cpf:
        return None, {"error": "CPF é obrigatório"}, 400

    user = User.query.filter_by(cpf=cpf).first()

    if user:
        logger.info(f"Atualizando usuário existente: CPF {cpf} (ID: {user.id})")
        if 'name' in data: user.name = data['name']
        if 'email' in data: user.email = data['email']
        if 'address' in data: user.address = data['address']
        if 'interests' in data: user.interests = json.dumps(data.get('interests', []))
        if 'activities' in data: user.activities = data.get('activities', '')
        if 'events_attended' in data: user.events_attended = json.dumps(data.get('events_attended', []))
        if 'purchases' in data: user.purchases = json.dumps(data.get('purchases', []))
        status_code = 200
    else:
        logger.info(f"Criando novo usuário: CPF {cpf}")
        if not data.get('name'):
            return None, {"error": "Nome é obrigatório para criar um novo usuário"}, 400
        if not data.get('email'):
             return None, {"error": "E-mail é obrigatório para criar um novo usuário"}, 400

        user = User(
            name=data['name'],
            email=data['email'],
            cpf=cpf,
            address=data.get('address'),
            interests=json.dumps(data.get('interests', [])),
            activities=data.get('activities', ''),
            events_attended=json.dumps(data.get('events_attended', [])),
            purchases=json.dumps(data.get('purchases', []))
        )
        db.session.add(user)
        status_code = 201

    try:
        db.session.commit()
        logger.info(f"Usuário salvo com sucesso: ID {user.id}, CPF {user.cpf} (Status {status_code})")
        return user, None, status_code
    except IntegrityError as e:
        db.session.rollback()
        error_msg = str(e.orig).lower()
        if 'unique constraint failed' in error_msg:
            if 'user.cpf' in error_msg:
                 logger.warning(f"CPF já existente: {cpf}")
                 return None, {"error": f"CPF {cpf} já cadastrado."}, 409
            elif 'user.email' in error_msg:
                 logger.warning(f"E-mail já existente: {data.get('email')}")
                 return None, {"error": f"E-mail {data.get('email')} já cadastrado."}, 409
        logger.error(f"Erro de integridade inesperado: {e}")
        return None, {"error": f"Erro de banco de dados ao salvar: {str(e)}"}, 500
    except Exception as e:
        db.session.rollback()
        logger.exception("Erro ao salvar usuário")
        return None, {"error": "Erro interno ao salvar no banco de dados"}, 500

def get_user_by_id(user_id):
    logger.info(f"Buscando usuário por ID: {user_id}")
    user = User.query.get(int(user_id))
    if not user:
        logger.warning(f"Usuário não encontrado: ID {user_id}")
    return user

def get_user_by_cpf(cpf):
    logger.info(f"Buscando usuário por CPF: {cpf}")
    user = User.query.filter_by(cpf=cpf).first()
    if not user:
        logger.warning(f"Usuário não encontrado: CPF {cpf}")
    return user