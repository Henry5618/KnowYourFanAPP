import re

def is_valid_cpf(cpf: str) -> bool:
    """ Valida formato básico do CPF XXX.XXX.XXX-XX """
    if not cpf:
        return False

    return bool(re.match(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', cpf))