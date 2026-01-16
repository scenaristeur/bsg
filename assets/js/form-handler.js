// assets/js/form-handler.js
document.getElementById('early-access-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    const email = form.email.value;

    // Désactiver le bouton et montrer un état de chargement
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    // RÉCUPÉREZ CET URL dans votre formulaire Grist (menu "Partager" > "Intégrer")
    const YOUR_GRIST_FORM_URL = "https://docs.getgrist.com/votre-doc-id/votre-table/form";

    // Créer un FormData pour l'envoi
    const formData = new FormData();
    formData.append('email', email);
    // Ajoutez un champ caché si vous voulez identifier la page source
    // formData.append('source_page', window.location.pathname);

    try {
        const response = await fetch(YOUR_GRIST_FORM_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Mode no-cors pour les formulaires cross-origin simples
        });

        // En mode 'no-cors', on ne peut pas lire la réponse, mais on suppose le succès.
        alert("Parfait ! Votre invitation est confirmée. Vous recevrez bientôt des nouvelles de l'aventure.");
        form.reset();

        // Mettre à jour le compteur d'invitations (exemple)
        const counter = document.getElementById('invites-taken');
        if (counter) counter.textContent = parseInt(counter.textContent) + 1;

    } catch (error) {
        console.error('Erreur:', error);
        alert("Une petite erreur s'est produite. Vous pouvez réessayer ou nous contacter directement.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});