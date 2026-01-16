// assets/js/form-handler.js
// Gestion de l'envoi du formulaire vers Grist et des retours utilisateur
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('early-access-form');
    if (!form) return; // Si le formulaire n'existe pas sur cette page, on ne fait rien

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // URL de votre formulaire Grist (À REMPLACER)
    const YOUR_GRIST_FORM_URL = "https://docs.getgrist.com/YOUR_DOC_ID/YOUR_TABLE_ID/form";

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Empêche le rechargement de la page

        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        // Validation basique de l'email
        if (!isValidEmail(email)) {
            showMessage("Veuillez saisir une adresse email valide.", 'error');
            return;
        }

        // Désactive le bouton et affiche un indicateur de chargement
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        // Création des données à envoyer
        const formData = new FormData();
        formData.append('email', email);

        // Ajouter automatiquement la source (nom de la page)
        const pageSource = window.location.pathname.split('/').pop() || 'home';
        formData.append('source', pageSource);

        try {
            // Envoi des données à Grist
            const response = await fetch(YOUR_GRIST_FORM_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Mode no-cors pour les formulaires cross-origin
            });

            // En mode 'no-cors', on ne peut pas lire la réponse, mais on considère que c'est un succès si aucune erreur réseau ne survient.
            showMessage("Parfait ! Vous êtes maintenant sur la liste. Préparez-vous à l'aventure.", 'success');
            form.reset(); // Vide le champ

            // Mise à jour visuelle du compteur d'invitations (si présent)
            updateInviteCounter();

        } catch (error) {
            console.error('Erreur lors de l\'envoi :', error);
            showMessage("Une erreur réseau s'est produite. Veuillez réessayer dans un instant.", 'error');
        } finally {
            // Réactive le bouton
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Fonction de validation d'email simple
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Fonction pour afficher des messages de feedback à l'utilisateur
    function showMessage(text, type) {
        // Supprime un message précédent
        const oldMessage = document.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();

        // Crée le nouvel élément de message
        const messageEl = document.createElement('p');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = text;
        messageEl.style.cssText = 'margin-top: 1rem; padding: 0.75rem; border-radius: 8px; font-weight: 500;';
        messageEl.style.backgroundColor = type === 'success' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)';
        messageEl.style.color = type === 'success' ? '#4CAF50' : '#F44336';

        // Insère le message après le formulaire
        form.parentNode.insertBefore(messageEl, form.nextSibling);

        // Fait disparaître le message après 5 secondes
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.opacity = '0';
                messageEl.style.transition = 'opacity 0.5s';
                setTimeout(() => messageEl.remove(), 500);
            }
        }, 5000);
    }

    // Fonction pour incrémenter le compteur d'invitations (visuel seulement)
    function updateInviteCounter() {
        const counterEl = document.getElementById('invites-taken');
        if (counterEl) {
            const currentCount = parseInt(counterEl.textContent, 10);
            if (!isNaN(currentCount)) {
                counterEl.textContent = currentCount + 1;

                // Met à jour la barre de progression (si présente)
                const progressFill = document.querySelector('.progress-fill');
                if (progressFill) {
                    const total = 500; // Total d'invitations, à adapter
                    const newPercent = Math.min(((currentCount + 1) / total) * 100, 100);
                    progressFill.style.width = `${newPercent}%`;
                }
            }
        }
    }
});