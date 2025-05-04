import os
import time
import random
import re
import requests
import logging
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("kyf_validation")

# Lista de palavras-chave para e-sports
ESPORTS_KEYWORDS = [
    "furia", "loud", "mibr", "imperial", "pain gaming", "fluxo", "los grandes",
    "csgo", "cs2", "counter-strike", "valorant", "league of legends", "lol",
    "free fire", "ff", "rainbow six", "r6", "dota2", "esports", "iem", "major",
    "cblol", "vct", "blast", "esl", "gaules", "bt"
]

# 1. Simulação da validação de documento
def simulate_id_validation(file_path):
    if not os.path.exists(file_path):
        logger.warning("Arquivo de ID não encontrado: %s", file_path)
        return {"status": "error", "message": "Arquivo de ID não encontrado no servidor."}

    time.sleep(random.uniform(0.5, 1.5))

    is_valid = random.choice([True, True, False])
    logger.info("Validação simulada do ID - resultado: %s", is_valid)

    return {
        "status": "validated" if is_valid else "failed",
        "message": "Documento parece válido (Simulado)." if is_valid else "Não foi possível validar o documento (Simulado)."
    }

# 2. Simulação de análise de redes sociais
def simulate_social_media_analysis(social_links):
    time.sleep(random.uniform(0.5, 1.5))
    logger.info("Iniciando análise de mídias sociais.")

    if not social_links or not isinstance(social_links, dict):
        logger.warning("Nenhum link social válido fornecido.")
        return {"status": "no_data", "message": "Nenhum link social válido fornecido."}

    combined_text = " ".join(str(v).lower() for v in social_links.values() if v).strip()

    if not combined_text:
        logger.warning("Nenhum texto extraído dos links sociais.")
        return {"status": "no_data", "message": "Nenhum texto encontrado nos links sociais."}

    found_keywords = {kw for kw in ESPORTS_KEYWORDS if re.search(rf'\b{re.escape(kw)}\b', combined_text)}
    related_orgs = [kw for kw in found_keywords if kw in ["furia", "loud", "mibr", "imperial", "pain gaming", "fluxo", "los grandes"]]

    if len(found_keywords) > 5 or len(related_orgs) > 1:
        engagement = "high"
    elif len(found_keywords) > 1 or related_orgs:
        engagement = "medium"
    elif found_keywords:
        engagement = "low"
    else:
        engagement = "very_low"

    logger.info("Análise concluída. Engajamento: %s", engagement)

    return {
        "status": "analyzed",
        "analysis": {
            "keywords_found": sorted(found_keywords),
            "related_orgs": sorted(related_orgs),
            "overall_engagement": engagement
        }
    }

# 3. Simulação de análise de relevância de perfil
def simulate_profile_relevance_analysis(profile_links, user_interests):
    time.sleep(random.uniform(0.5, 1.5))
    logger.info("Iniciando análise de relevância de perfis.")
    results = {}
    all_keywords_found = set()
    relevant_topics = set()

    safe_user_interests = [str(i).lower().strip() for i in user_interests if i and isinstance(i, str)]
    keywords = set(ESPORTS_KEYWORDS) | set(safe_user_interests)

    for site, url in profile_links.items():
        result = {"status": "pending", "keywords": [], "is_relevant": False, "message": None}

        if not url or not isinstance(url, str) or not url.startswith(('http://', 'https://')):
            result.update(status="error_invalid_url", message="Formato de URL inválido.")
            results[site] = result
            continue

        try:
            headers = {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'text/html',
                'Referer': 'https://www.google.com/'
            }

            response = requests.get(url, headers=headers, timeout=25)
            response.raise_for_status()

            if 'html' not in response.headers.get('Content-Type', '').lower():
                result.update(status="skipped_content_type", message="Conteúdo não é HTML.")
                results[site] = result
                continue

            soup = BeautifulSoup(response.content, 'html.parser')
            for tag in soup(["script", "style", "header", "footer", "nav", "aside"]):
                tag.decompose()

            text = soup.get_text(separator=' ', strip=True).lower()

            found = {kw for kw in keywords if re.search(rf'\b{re.escape(kw)}\b', text)}
            result["keywords"] = sorted(found)
            all_keywords_found.update(found)
            relevant_topics.update([k for k in found if k in ESPORTS_KEYWORDS])

            if len(found) >= 3 or any(k in found for k in ["furia", "csgo", "valorant", "lol", "major", "cblol", "vct"]):
                result.update(is_relevant=True, status="relevant", message=f"{len(found)} keywords encontradas. Relevante.")
            else:
                result.update(status="not_relevant", message=f"{len(found)} keywords encontradas. Não relevante.")

        except requests.exceptions.HTTPError as err:
            code = err.response.status_code
            if code == 403:
                result.update(status="error_blocked", message="Acesso Bloqueado (403).")
            elif code == 404:
                result.update(status="error_not_found", message="Página Não Encontrada (404).")
            else:
                result.update(status="error_http", message=f"Erro HTTP {code}.")
        except requests.exceptions.Timeout:
            result.update(status="error_timeout", message="Tempo limite excedido.")
        except requests.exceptions.ConnectionError:
            result.update(status="error_connection", message="Erro de conexão.")
        except Exception as e:
            logger.exception("Erro inesperado ao processar: %s", url)
            result.update(status="error_processing", message="Erro inesperado.")

        results[site] = result
        time.sleep(random.uniform(1.0, 2.5))

    overall_status = "analyzed"
    if all(res["status"].startswith("error") for res in results.values()):
        overall_status = "error"
    elif not any(res["status"] == "relevant" for res in results.values()):
        overall_status = "analyzed_not_relevant"
    elif any(res["status"].startswith("error") for res in results.values()):
        overall_status = "partial_error"

    return {
        "status": overall_status,
        "analysis_details": results,
        "summary": {
            "all_keywords": sorted(all_keywords_found),
            "relevant_topics": sorted(relevant_topics)
        }
    }

import os