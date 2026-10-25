/**
 * WayHome : bloc de recherche de la page d'accueil
 *
 * Fonctionnalités :
 *  1. Onglets accessibles (Acheter, Louer, Programmes neufs)
 *     - clic, ou flèches gauche/droite au clavier
 *  2. Envoi du formulaire : pré-remplit la demande de contact
 *     puis fait défiler la page jusqu'à la section contact
 */

(function () {
  'use strict';

  const onglets = Array.from(document.querySelectorAll('.onglet'));
  const formulaire = document.getElementById('panneau-recherche');
  const champSujet = document.getElementById('sujet');
  const champMessage = document.getElementById('message');

  if (!onglets.length || !formulaire) {
    return; // rien à initialiser sur cette page
  }

  /**
   * Active un onglet et met à jour les attributs ARIA.
   * @param {HTMLElement} onglet - bouton d'onglet à activer
   */
  function activerOnglet(onglet) {
    onglets.forEach((o) => {
      const actif = o === onglet;
      o.setAttribute('aria-selected', String(actif));
      o.tabIndex = actif ? 0 : -1;
    });

    formulaire.setAttribute('aria-labelledby', onglet.id);
    formulaire.dataset.type = onglet.dataset.type;
  }

  // Clic sur un onglet
  onglets.forEach((onglet) => {
    onglet.addEventListener('click', () => {
      activerOnglet(onglet);
      onglet.focus();
    });
  });

  // Navigation au clavier : flèches gauche et droite
  document.querySelector('.onglets').addEventListener('keydown', (evenement) => {
    const index = onglets.indexOf(document.activeElement);
    if (index === -1) return;

    let suivant = null;
    if (evenement.key === 'ArrowRight') suivant = onglets[(index + 1) % onglets.length];
    if (evenement.key === 'ArrowLeft') suivant = onglets[(index - 1 + onglets.length) % onglets.length];

    if (suivant) {
      evenement.preventDefault();
      activerOnglet(suivant);
      suivant.focus();
    }
  });

  // Libellés lisibles pour la demande de contact
  const libellesProjet = {
    location: 'location',
    achat: 'achat',
    neuf: 'programme neuf',
  };

  // Envoi : on transmet la recherche à la section contact
  formulaire.addEventListener('submit', (evenement) => {
    evenement.preventDefault();

    const ville = document.getElementById('ville').value.trim();
    const typeBien = document.getElementById('type-bien').value;
    const pieces = document.getElementById('pieces').value;
    const budget = document.getElementById('budget').value;
    const type = formulaire.dataset.type || 'location';

    // Résumé de la recherche, pré-rempli dans le formulaire de contact
    const morceaux = [
      'Je recherche un bien en ' + (libellesProjet[type] || type),
      ville ? 'à ' + ville : '',
      typeBien ? '(' + typeBien + ')' : '',
      pieces ? ', ' + pieces + ' pièce(s) minimum' : '',
      budget ? ', budget maximum ' + budget + ' €' : '',
      '.',
    ];
    const resume = morceaux.join(' ').replace(/\s+\./, '.').replace(/\s+,/, ',');

    // Type de projet correspondant dans la liste déroulante
    if (champSujet) {
      champSujet.value = type === 'achat' || type === 'neuf' ? 'achat' : 'location';
    }
    if (champMessage) {
      champMessage.value = resume;
    }

    // Défilement vers le contact et focus sur le nom
    const contact = document.getElementById('contact');
    contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const nom = document.getElementById('nom');
      if (nom) nom.focus({ preventScroll: true });
    }, 600);
  });
})();
