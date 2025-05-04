let currentUserId = null;

const basicInfoForm = document.getElementById('basic-info-form');
const loadUserBtn = document.getElementById('load-user-btn');
const loadUserStatus = document.getElementById('load-user-status');
const cpfInput = document.getElementById('cpf');
const emailInput = document.getElementById('email');
const userIdInput = document.getElementById('user-id');
const nameInput = document.getElementById('name');
const addressInput = document.getElementById('address');
const interestsInput = document.getElementById('interests');
const activitiesInput = document.getElementById('activities');
const eventsInput = document.getElementById('events');
const purchasesInput = document.getElementById('purchases');
const basicInfoStatus = document.getElementById('basic-info-status');
const basicInfoSaveButton = basicInfoForm.querySelector('button[type="submit"]');
const basicInfoInputs = [
  emailInput, nameInput, addressInput, interestsInput, activitiesInput, eventsInput, purchasesInput
];

const idValidationSection = document.getElementById('id-validation-section');
const idDocumentInput = document.getElementById('id_document');
const uploadDocBtn = document.getElementById('upload-doc-btn');
const idUploadStatus = document.getElementById('id-upload-status');
const validateIdBtn = document.getElementById('validate-id-btn');
const idValidationStatus = document.getElementById('id-validation-status');

const socialMediaSection = document.getElementById('social-media-section');
const socialLinksForm = document.getElementById('social-links-form');
const socialLinkStatus = document.getElementById('social-link-status');
const analyzeSocialBtn = document.getElementById('analyze-social-btn');
const socialAnalysisResult = document.getElementById('social-analysis-result');

const esportsProfileSection = document.getElementById('esports-profile-section');
const esportsProfileForm = document.getElementById('esports-profile-form');
const esportsLinkStatus = document.getElementById('esports-link-status');
const validateProfileBtn = document.getElementById('validate-profile-btn');
const profileRelevanceResult = document.getElementById('profile-relevance-result');

const summarySection = document.getElementById('summary-section');
const userSummary = document.getElementById('user-summary');

if (cpfInput) {
  cpfInput.addEventListener('input', () => {
    let value = cpfInput.value.replace(/\D/g, '');
    value = value.substring(0, 11);

    let formattedValue = '';
    if (value.length > 9) {
      formattedValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      formattedValue = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      formattedValue = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    } else if (value.length > 0) {
      formattedValue = value;
    } else {
      formattedValue = '';
    }

    if (formattedValue.endsWith('.')) {
      formattedValue = formattedValue.slice(0, -1);
    }

    cpfInput.value = formattedValue;
  });
} else {
  console.error('ERRO: Input CPF (\'cpf\') não encontrado para adicionar formatação.');
}

function showStatus(element, message, type = 'info') {
  if (element) {
    element.textContent = message;
    element.className = `status-${type}`;
    element.style.display = 'block';
  } else {
    console.warn('Tentativa de showStatus em elemento nulo');
  }
}

function hideStatus(element) {
  if (element) {
    element.style.display = 'none';
  }
}

function clearAndHideStatus(element) {
  if (element) {
    element.textContent = '';
    element.className = '';
    element.style.display = 'none';
  } else {
    console.warn('Tentativa de clearAndHideStatus em elemento nulo');
  }
}

function resetSecondaryUI() {
  idValidationSection.classList.add('hidden');
  socialMediaSection.classList.add('hidden');
  esportsProfileSection.classList.add('hidden');
  summarySection.classList.add('hidden');

  if (userSummary) {
    userSummary.textContent = '';
  }

  clearAndHideStatus(idUploadStatus);
  clearAndHideStatus(idValidationStatus);
  clearAndHideStatus(socialLinkStatus);
  if (socialAnalysisResult) {
    socialAnalysisResult.innerHTML = '';
    socialAnalysisResult.style.display = 'none';
  }
  clearAndHideStatus(esportsLinkStatus);
  if (profileRelevanceResult) {
    profileRelevanceResult.innerHTML = '';
    profileRelevanceResult.style.display = 'none';
  }

  if (idDocumentInput) {
    idDocumentInput.value = '';
  }
  if (socialLinksForm) {
    socialLinksForm.reset();
  }
  if (esportsProfileForm) {
    esportsProfileForm.reset();
  }

  if (validateIdBtn) {
    validateIdBtn.disabled = true;
  }
  if (analyzeSocialBtn) {
    analyzeSocialBtn.disabled = true;
  }
  if (validateProfileBtn) {
    validateProfileBtn.disabled = true;
  }
}

function setUIState(state, data = null) {
  console.log(`Setting UI State: ${state}, data ? User ID: ${data ? data.id : 'No data'}`);

  currentUserId = null;
  if (userIdInput) {
    userIdInput.value = '';
  }

  clearAndHideStatus(loadUserStatus);
  clearAndHideStatus(basicInfoStatus);

  let fieldsReadOnly = true;
  let saveDisabled = true;
  let cpfReadOnly = false;

  if (state === 'creating') {
    fieldsReadOnly = false;
    saveDisabled = false;
    basicInfoInputs.forEach(input => { if (input) input.value = ''; });
    if (data && data.cpf && cpfInput) {
      cpfInput.value = data.cpf;
    } else if (cpfInput) {
      cpfInput.value = '';
    }
    if (emailInput) {
        emailInput.value = '';
    }
    resetSecondaryUI();
    if (nameInput) {
      nameInput.focus();
    }
  } else if (state === 'updating' && data && data.id) {
    currentUserId = data.id;
    if (userIdInput) {
      userIdInput.value = data.id;
    }
    console.log(`>>> UI State 'updating': currentUserId SET TO ${currentUserId}`);
    fieldsReadOnly = false;
    saveDisabled = false;
    cpfReadOnly = true;
    populateBasicForm(data);
    idValidationSection.classList.remove('hidden');
    socialMediaSection.classList.remove('hidden');
    esportsProfileSection.classList.remove('hidden');
    summarySection.classList.remove('hidden');
    loadAndDisplaySummary(currentUserId);
    checkValidationStates(currentUserId);
  } else {
    state = 'initial';
    if (basicInfoForm) {
      basicInfoForm.reset();
    }
    cpfReadOnly = false;
    fieldsReadOnly = true;
    saveDisabled = true;
    resetSecondaryUI();
  }

  if (cpfInput) {
    cpfInput.readOnly = cpfReadOnly;
    cpfInput.style.backgroundColor = cpfReadOnly ? '#444' : '#333';
  }
  basicInfoInputs.forEach(input => {
    if (input) {
      input.readOnly = fieldsReadOnly;
      input.style.backgroundColor = fieldsReadOnly ? '#444' : '#333';
    }
  });
  if (basicInfoSaveButton) {
    basicInfoSaveButton.disabled = saveDisabled;
  }
  if (loadUserBtn) {
    loadUserBtn.disabled = false;
  }

  console.log(`UI State set to: ${state}. Final currentUserId: ${currentUserId}`);
}

function populateBasicForm(data) {
  if (!data || !basicInfoForm) {
    return;
  }

  if (cpfInput) {
    cpfInput.value = data.cpf || '';
  }
  if (emailInput) {
    emailInput.value = data.email || '';
  }
  if (nameInput) {
    nameInput.value = data.name || '';
  }
  if (addressInput) {
    addressInput.value = data.address || '';
  }
  if (interestsInput) {
    interestsInput.value = (Array.isArray(data.interests) ? data.interests : []).join(', ');
  }
  if (activitiesInput) {
    activitiesInput.value = data.activities || '';
  }
  if (eventsInput) {
    eventsInput.value = (Array.isArray(data.events_attended) ? data.events_attended : []).join(', ');
  }
  if (purchasesInput) {
    purchasesInput.value = (Array.isArray(data.purchases) ? data.purchases : []).join(', ');
  }

  if (socialLinksForm) {
    socialLinksForm.reset();
  }
  if (esportsProfileForm) {
    esportsProfileForm.reset();
  }

  if (data.social_media_links && typeof data.social_media_links === 'object' && socialLinksForm) {
    for (const platform in data.social_media_links) {
      const input = socialLinksForm.querySelector(`[name="${platform}"]`);
      if (input) { input.value = data.social_media_links[platform]; }
    }
  }
  if (data.esports_profile_links && typeof data.esports_profile_links === 'object' && esportsProfileForm) {
    for (const site in data.esports_profile_links) {
      const input = esportsProfileForm.querySelector(`[name="${site}"]`);
      if (input) { input.value = data.esports_profile_links[site]; }
    }
  }
  console.log('populateBasicForm - Populated fields.');
}

async function getUserData(userId) {
  if (!userId) {
    console.error('getUserData: userId é inválido:', userId);
    throw new Error('ID de usuário inválido');
  }
  console.log(`API: Fetching data for user ${userId}`);
  return fetchAPI(`/users/${userId}`, 'GET');
}


async function loadAndDisplaySummary(userId) {
  console.log('loadAndDisplaySummary - UserID:', userId);
  if (!userId || !userSummary) return;

  userSummary.innerHTML = '<p class="status-info">Carregando resumo...</p>';
  summarySection.classList.remove('hidden');

  try {
    const userData = await getUserData(userId);
    userSummary.innerHTML = '';

    function createSummaryEntry(label, value, valueClass = '') {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${label}:`;
        p.appendChild(strong);

        const span = document.createElement('span');
        span.textContent = value;
        if (valueClass) {
            span.className = valueClass;
        }
        p.appendChild(span);
        userSummary.appendChild(p);
    }

    function createSummaryList(label, items) {
        if (!Array.isArray(items) || items.length === 0) {
            createSummaryEntry(label, 'Nenhum');
            return;
        }
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${label}:`;
        p.appendChild(strong);

        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        p.appendChild(ul);
        userSummary.appendChild(p);
    }

     function createSummaryLinkList(label, linkObject) {
        if (!linkObject || typeof linkObject !== 'object' || Object.keys(linkObject).length === 0) {
            createSummaryEntry(label, 'Nenhum');
            return;
        }
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${label}:`;
        p.appendChild(strong);

        const ul = document.createElement('ul');
        for (const key in linkObject) {
            if (linkObject[key]) {
                const li = document.createElement('li');
                const linkStrong = document.createElement('strong');
                linkStrong.textContent = `${key}:`;
                li.appendChild(linkStrong);

                const a = document.createElement('a');
                a.href = linkObject[key];
                a.textContent = linkObject[key];
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                li.appendChild(a);
                ul.appendChild(li);
            }
        }
         if (ul.children.length === 0) {
             p.appendChild(document.createTextNode(' Nenhum'));
         } else {
            p.appendChild(ul);
         }
        userSummary.appendChild(p);
    }

    createSummaryEntry('ID Interno', userData.id);
    createSummaryEntry('Nome', userData.name || 'N/A');
    createSummaryEntry('CPF', userData.cpf || 'N/A');
    createSummaryEntry('E-mail', userData.email || 'Nenhum');
    createSummaryEntry('Endereço', userData.address || 'Nenhum');

    createSummaryList('Interesses', userData.interests);
    createSummaryEntry('Atividades Descritas', userData.activities || 'Nenhuma');
    createSummaryList('Eventos Frequentados', userData.events_attended);
    createSummaryList('Compras Relacionadas', userData.purchases);

    let docStatusText = 'Pendente/Não enviado';
    let docStatusClass = 'summary-status-info';
    if (userData.id_document_path) {
        const filename = userData.id_document_path.split(/[\\/]/).pop();
         createSummaryEntry('Documento Enviado', filename);
         switch (userData.id_validation_status) {
             case 'validated':
                 docStatusText = 'Validado (Simulado)';
                 docStatusClass = 'summary-status-validated';
                 break;
             case 'failed':
                 docStatusText = 'Falha na Validação (Simulado)';
                 docStatusClass = 'summary-status-failed';
                 break;
             case 'pending':
                 docStatusText = 'Validação Pendente';
                 docStatusClass = 'summary-status-pending';
                 break;
             default:
                 docStatusText = userData.id_validation_status || 'Status Desconhecido';
                 docStatusClass = 'summary-status-info';
         }
    } else {
         createSummaryEntry('Documento Enviado', 'Não');
    }
     createSummaryEntry('Status Validação ID', docStatusText, docStatusClass);


     createSummaryLinkList('Links Sociais', userData.social_media_links);
     if (userData.social_media_analysis && userData.social_media_analysis.status && userData.social_media_analysis.status !== 'no_data') {
        if(userData.social_media_analysis.status === 'analyzed') {
            const analysis = userData.social_media_analysis.analysis || {};
            let engagementText = 'Não Calculado';
             switch (analysis.overall_engagement) {
                case 'high': engagementText = 'Alto'; break;
                case 'medium': engagementText = 'Médio'; break;
                case 'low': engagementText = 'Baixo'; break;
                case 'very_low': engagementText = 'Muito Baixo'; break;
            }
            createSummaryEntry('Análise Social', `Engajamento ${engagementText} (Simulado)`, 'summary-status-success');
        } else {
             createSummaryEntry('Análise Social', `Status: ${userData.social_media_analysis.status}`, 'summary-status-info');
        }
     } else {
         createSummaryEntry('Análise Social', 'Não realizada ou sem dados');
     }


    createSummaryLinkList('Perfis E-sports', userData.esports_profile_links);
     if (userData.profile_relevance_analysis && userData.profile_relevance_analysis.status && userData.profile_relevance_analysis.status !== 'no_data') {
         let profileStatusText = 'Status Desconhecido';
         let profileStatusClass = 'summary-status-info';
         switch (userData.profile_relevance_analysis.status) {
            case 'analyzed':
                profileStatusText = 'Análise Concluída com Sucesso';
                profileStatusClass = 'summary-status-success';
                 break;
            case 'analyzed_not_relevant':
                profileStatusText = 'Análise Concluída (Sem Relevância)';
                profileStatusClass = 'summary-status-info';
                 break;
            case 'partial_error':
                profileStatusText = 'Análise Concluída com Erros';
                profileStatusClass = 'summary-status-error';
                 break;
             case 'error':
                profileStatusText = 'Erro Geral na Análise';
                profileStatusClass = 'summary-status-error';
                 break;
            default:
                profileStatusText = `Status: ${userData.profile_relevance_analysis.status}`;
         }
          createSummaryEntry('Análise de Relevância', profileStatusText, profileStatusClass);
     } else {
         createSummaryEntry('Análise de Relevância', 'Não realizada ou sem dados');
     }

  } catch (error) {
    userSummary.innerHTML = `<p class="status-error">Erro ao carregar resumo: ${error.message}</p>`;
  }
}


async function checkValidationStates(userId) {
  console.log('checkValidationStates - UserID:', userId);
  if (!userId) {
    console.error('checkValidationStates called with null userId!');
    return;
  }

  try {
    const userData = await getUserData(userId);
    console.log('checkValidationStates - Fetched Data:', userData);

    if (validateIdBtn) {
      validateIdBtn.disabled = !userData.id_document_path;
    }
    console.log(
      `checkValidationStates - Validate Button Disabled: ${validateIdBtn?.disabled} (path: ${userData.id_document_path})`
    );

    if (userData.id_validation_status && userData.id_validation_status !== 'pending') {
      let displayMessage = '';
      let type = 'info';
      switch (userData.id_validation_status) {
          case 'validated':
              displayMessage = 'Documento Validado com Sucesso (Simulado)';
              type = 'success';
              break;
          case 'failed':
              displayMessage = 'Falha na Validação do Documento (Simulado)';
              type = 'error';
              break;
          default:
              displayMessage = `Status Validação: ${userData.id_validation_status}`;
      }
      showStatus(idValidationStatus, displayMessage, type);
    } else {
      clearAndHideStatus(idValidationStatus);
    }

    const hasSocialLinks = userData.social_media_links && typeof userData.social_media_links === 'object' && Object.keys(userData.social_media_links).length > 0;
    if (analyzeSocialBtn) {
      analyzeSocialBtn.disabled = !hasSocialLinks;
    }
    console.log(`checkValidationStates - Analyze Social Button Disabled: ${analyzeSocialBtn?.disabled}`);

    if (userData.social_media_analysis && typeof userData.social_media_analysis === 'object') {
      displaySocialAnalysis(userData.social_media_analysis);
    } else {
      if (socialAnalysisResult) {
        socialAnalysisResult.innerHTML = '';
        socialAnalysisResult.style.display = 'none';
      }
    }

    const hasProfileLinks = userData.esports_profile_links && typeof userData.esports_profile_links === 'object' && Object.keys(userData.esports_profile_links).length > 0;
    if (validateProfileBtn) {
      validateProfileBtn.disabled = !hasProfileLinks;
    }
    console.log(`checkValidationStates - Validate Profile Button Disabled: ${validateProfileBtn?.disabled}`);

    if (userData.profile_relevance_analysis && typeof userData.profile_relevance_analysis === 'object') {
      displayProfileRelevance(userData.profile_relevance_analysis);
    } else {
      if (profileRelevanceResult) {
        profileRelevanceResult.innerHTML = '';
        profileRelevanceResult.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Erro ao verificar estados de validação:', error);
    if (validateIdBtn) {
      validateIdBtn.disabled = true;
    }
    if (analyzeSocialBtn) {
      analyzeSocialBtn.disabled = true;
    }
    if (validateProfileBtn) {
      validateProfileBtn.disabled = true;
    }
  }
}

function displaySocialAnalysis(analysisData) {
  if (!socialAnalysisResult) {
    return;
  }

  let html = '';
  let type = 'info';

  if (!analysisData || !analysisData.status || analysisData.status === 'no_data') {
    html = '<p>Nenhum link social encontrado para análise.</p>';
  } else if (analysisData.status === 'error') {
    html = `<p>Erro na Análise Social (Simulada): ${analysisData.message || 'Erro desconhecido'}</p>`;
    type = 'error';
  } else if (analysisData.status === 'analyzed') {
    const analysis = analysisData.analysis || {};
    let engagementText = 'Não Calculado';
    let keywordsText = 'Nenhuma';
    let orgsText = 'Nenhuma';

    switch (analysis.overall_engagement) {
        case 'high': engagementText = 'Alto'; break;
        case 'medium': engagementText = 'Médio'; break;
        case 'low': engagementText = 'Baixo'; break;
        case 'very_low': engagementText = 'Muito Baixo'; break;
    }

    if (Array.isArray(analysis.keywords_found) && analysis.keywords_found.length > 0) {
        keywordsText = analysis.keywords_found.join(', ');
    }
    if (Array.isArray(analysis.related_orgs) && analysis.related_orgs.length > 0) {
        orgsText = analysis.related_orgs.join(', ');
    }

    type = 'success';
    html = '<h4>Resultado Análise Social (Simulada)</h4>';
    html += `<p><strong>Engajamento Geral (Simulado):</strong> ${engagementText}</p>`;
    html += `<p><strong>Keywords Encontradas:</strong> ${keywordsText}</p>`;
    html += `<p><strong>Organizações Relacionadas:</strong> ${orgsText}</p>`;
  } else {
    html = `<p>Status Análise Social: ${analysisData.status}. ${analysisData.message || ''}</p>`;
    type = 'info';
  }

  socialAnalysisResult.innerHTML = html;
  socialAnalysisResult.className = `status-${type}`;
  socialAnalysisResult.style.display = 'block';
}

function displayProfileRelevance(analysisData) {
  if (!profileRelevanceResult) {
    return;
  }

  let html = '';
  let type = 'info';

  if (!analysisData || !analysisData.status || analysisData.status === 'no_data') {
    html = '<p>Nenhum dado ou análise de perfil disponível.</p>';
  } else if (analysisData.status && analysisData.status.startsWith('error') && !analysisData.analysis_details) {
    html = `<p>Erro geral na análise de perfil: ${analysisData.message || 'Erro desconhecido'}</p>`;
    type = 'error';
  } else if (analysisData.analysis_details) {
    const details = analysisData.analysis_details || {};
    const summary = analysisData.summary || {};
    const statuses = Object.values(details).map(res => res.status);

    if (statuses.some(s => s?.startsWith('error'))) {
      type = 'error';
    } else if (statuses.every(s => s === 'not_relevant' || s === 'skipped_content_type')) {
      type = 'info';
    } else if (statuses.some(s => s === 'relevant')) {
      type = 'success';
    } else {
      type = 'info';
    }

    let displayStatusText = analysisData.status || 'N/A';
    switch (analysisData.status) {
        case 'partial_error':
            displayStatusText = 'Análise Concluída com Erros';
            break;
        case 'analyzed_not_relevant':
            displayStatusText = 'Análise Concluída (Sem Relevância)';
            break;
        case 'error':
            displayStatusText = 'Erro Geral na Análise';
            break;
        case 'analyzed':
            displayStatusText = 'Análise Concluída com Sucesso';
            break;
    }

    html = '<h4>Resultado Análise de Relevância (Simulada)</h4>';
    html += `<p><strong>Status Geral:</strong> ${displayStatusText}</p>`;
    html += `<p><strong>Keywords Totais Encontradas:</strong> ${(Array.isArray(summary.all_keywords) ? summary.all_keywords : []).join(', ') || 'Nenhuma'}</p>`;
    html += `<p><strong>Tópicos Relevantes (E-sports):</strong> ${(Array.isArray(summary.relevant_topics) ? summary.relevant_topics : []).join(', ') || 'Nenhuma'}</p>`;
    html += '<h5>Detalhes por Perfil:</h5><ul>';

    for (const site in details) {
      const result = details[site];
      let statusClass = 'status-info';
      let statusText = result.status || 'N/A';

      switch (result.status) {
        case 'relevant': statusClass = 'status-success'; statusText = 'Relevante'; break;
        case 'not_relevant': statusClass = 'status-info'; statusText = 'Não Relevante'; break;
        case 'error_blocked': statusClass = 'status-error'; statusText = 'Bloqueado (403)'; break;
        case 'error_not_found': statusClass = 'status-error'; statusText = 'Não Encontrado (404)'; break;
        case 'error_timeout': statusClass = 'status-error'; statusText = 'Timeout'; break;
        case 'error_connection': statusClass = 'status-error'; statusText = 'Erro Conexão'; break;
        case 'error_http': statusClass = 'status-error'; statusText = `Erro HTTP (${result.message?.match(/\d+/)?.[0] || '?'})`; break;
        case 'error_invalid_url': statusClass = 'status-error'; statusText = 'URL Inválida'; break;
        case 'error_processing': statusClass = 'status-error'; statusText = 'Erro Processamento'; break;
        case 'skipped_content_type': statusClass = 'status-info'; statusText = 'Não HTML'; break;
        default: statusText = result.status;
      }

      html += `<li><strong>${site}:</strong> `;
      html += `<span class="${statusClass}"> ${statusText}</span><br>`;

      if (result.message && result.status?.startsWith('error')) {
        html += ` <small><i>Detalhe: ${result.message}</i></small><br>`;
      }
      if (result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && result.status === 'relevant') {
        html += ` <small>Keywords: ${result.keywords.join(', ')}</small>`;
      } else if (result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && result.status === 'not_relevant') {
        html += ` <small>Keywords encontradas: ${result.keywords.length}</small>`;
      }
      html += '</li>';
    }
    html += '</ul>';
  } else {
    html = `<p>Status validação perfil: ${analysisData.status}. ${analysisData.message || ''}</p>`;
    type = analysisData.status?.startsWith('error') ? 'error' : 'info';
  }

  profileRelevanceResult.innerHTML = html;
  profileRelevanceResult.className = `status-${type}`;
  profileRelevanceResult.style.display = 'block';
}

if (loadUserBtn) {
  loadUserBtn.addEventListener('click', async () => {
    const cpf = cpfInput.value.trim();
    setUIState('initial');

    if (!cpf) {
      showStatus(loadUserStatus, 'Por favor, digite o CPF.', 'error');
      return;
    }

    showStatus(loadUserStatus, 'Verificando CPF...', 'info');
    loadUserBtn.disabled = true;

    try {
      const checkResponse = await fetchAPI('/users', 'POST', { cpf: cpf });
      setUIState('updating', checkResponse);
      showStatus(loadUserStatus, `Usuário ${checkResponse.name} carregado.`, 'success');
    } catch (error) {
      if (error.message && error.message.toLowerCase().includes('nome é obrigatório')) {
        setUIState('creating', { cpf: cpf });
        showStatus(loadUserStatus, 'CPF não cadastrado. Preencha os dados para criar.', 'info');
      } else if (error.message && error.message.includes('409')) {
        showStatus(loadUserStatus, `Erro: ${error.message}. Tente carregar novamente.`, 'error');
        setUIState('initial');
        if (cpfInput) {
          cpfInput.value = cpf;
        }
      } else {
        showStatus(loadUserStatus, `Erro ao verificar CPF: ${error.message}`, 'error');
        setUIState('initial');
        if (cpfInput) {
          cpfInput.value = cpf;
        }
      }
    } finally {
      loadUserBtn.disabled = false;
    }
  });
} else {
  console.error('ERRO: Botão \'load-user-btn\' não encontrado.');
}

if (basicInfoForm) {
  basicInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAndHideStatus(basicInfoStatus);

    const isUpdate = !!currentUserId;
    console.log('Submit Basic Info - Is Update:', isUpdate, 'User ID:', currentUserId);

    const interests = interestsInput.value.split(',').map(item => item.trim()).filter(Boolean);
    const events = eventsInput.value.split(',').map(item => item.trim()).filter(Boolean);
    const purchases = purchasesInput.value.split(',').map(item => item.trim()).filter(Boolean);
    const userData = {
      cpf: cpfInput.value.trim(),
      email: emailInput.value.trim(),
      name: nameInput.value.trim(),
      address: addressInput.value.trim(),
      interests: interests,
      activities: activitiesInput.value.trim(),
      events_attended: events,
      purchases: purchases
    };

    if (!userData.cpf || !userData.name || !userData.email) {
      showStatus(basicInfoStatus, 'CPF, E-mail e Nome Completo são obrigatórios.', 'error');
      return;
    }
     if (userData.cpf.length !== 14) {
        showStatus(basicInfoStatus, 'CPF parece inválido. Verifique o formato.', 'error');
        return;
    }
    if (!userData.email.includes('@') || !userData.email.includes('.')) {
         showStatus(basicInfoStatus, 'Formato de e-mail inválido.', 'error');
         return;
    }


    showStatus(basicInfoStatus, isUpdate ? 'Atualizando...' : 'Criando usuário...', 'info');
    if (basicInfoSaveButton) {
      basicInfoSaveButton.disabled = true;
    }

    try {
      const savedUser = await fetchAPI('/users', 'POST', userData);

      if (isUpdate) {
        setUIState('updating', savedUser);
        showStatus(basicInfoStatus, 'Informações atualizadas com sucesso!', 'success');
      } else {
        showStatus(basicInfoStatus, 'Usuário criado com sucesso! Clique em "Carregar Dados por CPF" para continuar.', 'success');
        setUIState('initial');
        if (cpfInput) {
          cpfInput.value = savedUser.cpf;
        }
      }
    } catch (error) {
      if (error.message && (error.message.includes('409') || (error.message.toLowerCase().includes('cpf') && error.message.toLowerCase().includes('cadastrado')))) {
        showStatus(basicInfoStatus, `Erro: CPF (${userData.cpf}) já está cadastrado.`, 'error');
        setUIState('initial');
        if (cpfInput) {
          cpfInput.value = userData.cpf;
        }
      } else if (error.message && error.message.toLowerCase().includes('email') && error.message.toLowerCase().includes('cadastrado')) {
        showStatus(basicInfoStatus, `Erro: E-mail (${userData.email}) já está cadastrado.`, 'error');
        if (basicInfoSaveButton) basicInfoSaveButton.disabled = false;
      }
      else {
        showStatus(basicInfoStatus, `Erro ao salvar: ${error.message}`, 'error');
        if (basicInfoSaveButton) basicInfoSaveButton.disabled = false;
      }

    }
  });
} else {
  console.error('ERRO: Formulário \'basic-info-form\' não encontrado.');
}

if (uploadDocBtn && idDocumentInput) {
  uploadDocBtn.addEventListener('click', async () => {
    clearAndHideStatus(idUploadStatus);
    const userIdForUpload = currentUserId;
    console.log('ID Upload CLICK - Current User ID:', userIdForUpload);

    if (!userIdForUpload) {
      showStatus(idUploadStatus, 'ERRO: Nenhum usuário carregado.', 'error');
      return;
    }
    if (idDocumentInput.files.length === 0) {
      showStatus(idUploadStatus, 'Nenhum arquivo selecionado.', 'error');
      return;
    }

    const file = idDocumentInput.files[0];
    const formData = new FormData();
    formData.append('id_document', file);

    showStatus(idUploadStatus, 'Enviando documento...', 'info');
    uploadDocBtn.disabled = true;
    if (validateIdBtn) {
      validateIdBtn.disabled = true;
    }

    try {
      const response = await uploadIdDocument(userIdForUpload, formData);
      showStatus(idUploadStatus, response.message || 'Documento enviado com sucesso.', 'success');
      idDocumentInput.value = '';
      clearAndHideStatus(idValidationStatus);

      await checkValidationStates(userIdForUpload);
      await loadAndDisplaySummary(userIdForUpload);
    } catch (error) {
      showStatus(idUploadStatus, `Erro no upload: ${error.message}`, 'error');
      console.error('Upload Error Details:', error);
      try { await checkValidationStates(userIdForUpload); } catch { /* ignore */ }
    } finally {
      uploadDocBtn.disabled = false;
    }
  });
} else {
  console.error('ERRO: Botão \'upload-doc-btn\' ou Input \'id_document\' não encontrado.');
}

if (validateIdBtn) {
  validateIdBtn.addEventListener('click', async () => {
    clearAndHideStatus(idValidationStatus);
    const userIdToValidate = currentUserId;
    console.log('Validate ID Click - Current User ID:', userIdToValidate);

    if (!userIdToValidate) {
      showStatus(idValidationStatus, 'ERRO: Usuário não carregado.', 'error');
      return;
    }

    showStatus(idValidationStatus, 'Iniciando validação simulada...', 'info');
    validateIdBtn.disabled = true;

    try {
      const result = await triggerIdValidation(userIdToValidate);
      let displayMessage = '';
      let type = 'info';

      switch (result.status) {
          case 'validated':
              displayMessage = 'Documento Validado com Sucesso (Simulado)';
              type = 'success';
              break;
          case 'failed':
              displayMessage = 'Falha na Validação do Documento (Simulado)';
              type = 'error';
              break;
          case 'error':
              displayMessage = `Erro na Simulação: ${result.message || 'Erro desconhecido'}`;
              type = 'error';
              break;
          default:
              displayMessage = `Status Desconhecido: ${result.status} (${result.message || ''})`;
              type = 'info';
      }
      showStatus(idValidationStatus, displayMessage, type);
      await loadAndDisplaySummary(userIdToValidate);

    } catch (error) {
      showStatus(idValidationStatus, `Erro ao validar ID: ${error.message}`, 'error');
    } finally {
      try { await checkValidationStates(userIdToValidate); } catch { /* ignore */ }
    }
  });
} else {
  console.error('ERRO: Botão \'validate-id-btn\' não encontrado.');
}

if (socialLinksForm) {
  socialLinksForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAndHideStatus(socialLinkStatus);
    const userIdToLink = currentUserId;
    console.log('Social Link Submit - Current User ID:', userIdToLink);

    if (!userIdToLink) {
      showStatus(socialLinkStatus, 'ERRO: Usuário não carregado.', 'error');
      return;
    }

    const formData = new FormData(e.target);
    const socialLinks = {};
    let hasError = false;

    for (let [key, value] of formData.entries()) {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        let isValidUrl = false;
        if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
          try {
            new URL(trimmedValue);
            isValidUrl = true;
          } catch (_) {
            isValidUrl = false;
          }
        }

        if (!isValidUrl) {
          showStatus(socialLinkStatus, `URL inválida para ${key}. Insira um link completo (ex: https://...).`, 'error');
          hasError = true;
          break;
        }
        socialLinks[key] = trimmedValue;
      } else {
        socialLinks[key] = '';
      }
    }

    if (hasError) {
      return;
    }

    showStatus(socialLinkStatus, 'Salvando links sociais...', 'info');
    const button = socialLinksForm.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
    }
    if (analyzeSocialBtn) {
      analyzeSocialBtn.disabled = true;
    }

    try {
      await saveSocialLinks(userIdToLink, { social_media: socialLinks });
      showStatus(socialLinkStatus, 'Links sociais salvos com sucesso.', 'success');
      await checkValidationStates(userIdToLink);
      await loadAndDisplaySummary(userIdToLink);
    } catch (error) {
      showStatus(socialLinkStatus, `Erro ao salvar links: ${error.message}`, 'error');
      try { await checkValidationStates(userIdToLink); } catch { /* ignore */ }
    } finally {
      if (button) {
        button.disabled = false;
      }
       try { await checkValidationStates(userIdToLink); } catch { /* ignore */ }
    }
  });
} else {
  console.error('ERRO: Formulário \'social-links-form\' não encontrado.');
}

if (analyzeSocialBtn) {
  analyzeSocialBtn.addEventListener('click', async () => {
    const userIdToAnalyze = currentUserId;
    console.log('Analyze Social Click - Current User ID:', userIdToAnalyze);

    if (!userIdToAnalyze) {
      if (socialAnalysisResult) {
        socialAnalysisResult.innerHTML = '<p>ERRO: Usuário não carregado.</p>';
        socialAnalysisResult.className = 'status-error';
        socialAnalysisResult.style.display = 'block';
      }
      return;
    }

    if (socialAnalysisResult) {
      socialAnalysisResult.innerHTML = '<p>Analisando atividade social (simulado)...</p>';
      socialAnalysisResult.className = 'status-info';
      socialAnalysisResult.style.display = 'block';
    }
    analyzeSocialBtn.disabled = true;

    try {
      const result = await triggerSocialAnalysis(userIdToAnalyze);
      displaySocialAnalysis(result);
      await loadAndDisplaySummary(userIdToAnalyze);
    } catch (error) {
      if (socialAnalysisResult) {
        socialAnalysisResult.innerHTML = `<p>Erro na análise social: ${error.message}</p>`;
        socialAnalysisResult.className = 'status-error';
        socialAnalysisResult.style.display = 'block';
      }
    } finally {
      try { await checkValidationStates(userIdToAnalyze); } catch { /* ignore */ }
    }
  });
} else {
  console.error('ERRO: Botão \'analyze-social-btn\' não encontrado.');
}

if (esportsProfileForm) {
  esportsProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAndHideStatus(esportsLinkStatus);
    const userIdToLinkProfile = currentUserId;
    console.log('Esports Link Submit - Current User ID:', userIdToLinkProfile);

    if (!userIdToLinkProfile) {
      showStatus(esportsLinkStatus, 'ERRO: Usuário não carregado.', 'error');
      return;
    }

    const formData = new FormData(e.target);
    const profileLinks = {};
    let hasError = false;
    for (let [key, value] of formData.entries()) {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        if (!trimmedValue.startsWith('http://') && !trimmedValue.startsWith('https://')) {
          showStatus(esportsLinkStatus, `URL inválida para ${key}: deve começar com http:// ou https://`, 'error');
          hasError = true;
          break;
        }
        try {
          new URL(trimmedValue);
          profileLinks[key] = trimmedValue;
        } catch (_) {
          showStatus(esportsLinkStatus, `Formato de URL inválido para ${key}.`, 'error');
          hasError = true;
          break;
        }
      }
    }

    if (hasError) {
      return;
    }

    showStatus(esportsLinkStatus, 'Salvando links de perfis...', 'info');
    const button = esportsProfileForm.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
    }
    if (validateProfileBtn) {
      validateProfileBtn.disabled = true;
    }

    try {
      await saveEsportsProfiles(userIdToLinkProfile, { esports_profiles: profileLinks });
      showStatus(esportsLinkStatus, 'Links de perfis salvos com sucesso.', 'success');
      await checkValidationStates(userIdToLinkProfile);
      await loadAndDisplaySummary(userIdToLinkProfile);
    } catch (error) {
      showStatus(esportsLinkStatus, `Erro ao salvar perfis: ${error.message}`, 'error');
      try { await checkValidationStates(userIdToLinkProfile); } catch { /* ignore */ }
    } finally {
      if (button) {
        button.disabled = false;
      }
    }
  });
} else {
  console.error('ERRO: Formulário \'esports-profile-form\' não encontrado.');
}

if (validateProfileBtn) {
  validateProfileBtn.addEventListener('click', async () => {
    const userIdToValidateProfile = currentUserId;
    console.log('Validate Profile Click - Current User ID:', userIdToValidateProfile);

    if (!userIdToValidateProfile) {
      if (profileRelevanceResult) {
        profileRelevanceResult.innerHTML = '<p>ERRO: Usuário não carregado.</p>';
        profileRelevanceResult.className = 'status-error';
        profileRelevanceResult.style.display = 'block';
      }
      return;
    }

    if (profileRelevanceResult) {
      profileRelevanceResult.innerHTML = '<p>Validando relevância dos perfis (simulado, pode demorar)...</p>';
      profileRelevanceResult.className = 'status-info';
      profileRelevanceResult.style.display = 'block';
    }
    validateProfileBtn.disabled = true;

    try {
      const result = await triggerProfileValidation(userIdToValidateProfile);
      displayProfileRelevance(result);
      await loadAndDisplaySummary(userIdToValidateProfile);
    } catch (error) {
      if (profileRelevanceResult) {
        profileRelevanceResult.innerHTML = `<p>Erro na validação de perfis: ${error.message}</p>`;
        profileRelevanceResult.className = 'status-error';
        profileRelevanceResult.style.display = 'block';
      }
    } finally {
      try { await checkValidationStates(userIdToValidateProfile); } catch { /* ignore */ }
    }
  });
} else {
  console.error('ERRO: Botão \'validate-profile-btn\' não encontrado.');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Carregado. Configurando estado inicial.');
  if (basicInfoForm && loadUserBtn && cpfInput && emailInput && basicInfoSaveButton && uploadDocBtn &&
      idDocumentInput && validateIdBtn && socialLinksForm && analyzeSocialBtn &&
      esportsProfileForm && validateProfileBtn && summarySection && userSummary) {
    setUIState('initial');
  } else {
    console.error('ERRO FATAL: Elementos essenciais da UI não foram encontrados no DOM durante a inicialização.');
    const body = document.querySelector('body');
    if (body) {
      body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">Erro Crítico ao Carregar a Interface. Verifique o console (F12).</h1>';
    }
  }
});