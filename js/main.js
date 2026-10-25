/**
 * WayHome : script principal (JavaScript natif, sans bibliothèque)
 *
 * Fonctionnalités :
 *  1. Année courante dans le footer
 *  2. Menu mobile accessible (clavier + Échap)
 *  3. Ombre du header au défilement
 *  4. Apparition des éléments au scroll (IntersectionObserver)
 *  5. Compteurs animés des chiffres clés
 *  6. Validation du formulaire de contact côté client
 */

(function () {
  'use strict';

  // Respect de la préférence utilisateur « réduire les animations »
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. Année courante dans le footer
     ---------------------------------------------------------- */
  const anneeEl = document.getElementById('annee');
  if (anneeEl) {
    anneeEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     2. Menu mobile
     ---------------------------------------------------------- */
  const boutonMenu = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-principal');

  /**
   * Ouvre ou ferme le menu mobile et met à jour les attributs ARIA.
   * @param {boolean} ouvrir - true pour ouvrir, false pour fermer
   */
  function basculerMenu(ouvrir) {
    boutonMenu.setAttribute('aria-expanded', String(ouvrir));
    menu.classList.toggle('is-open', ouvrir);
    boutonMenu.querySelector('.sr-only').textContent = ouvrir ? 'Fermer le menu' : 'Ouvrir le menu';
  }

  if (boutonMenu && menu) {
    boutonMenu.addEventListener('click', () => {
      const estOuvert = boutonMenu.getAttribute('aria-expanded') === 'true';
      basculerMenu(!estOuvert);
    });

    // Fermer le menu quand on clique sur un lien
    menu.querySelectorAll('a').forEach((lien) => {
      lien.addEventListener('click', () => basculerMenu(false));
    });

    // Échap ferme le menu et rend le focus au bouton
    document.addEventListener('keydown', (evenement) => {
      if (evenement.key === 'Escape' && boutonMenu.getAttribute('aria-expanded') === 'true') {
        basculerMenu(false);
        boutonMenu.focus();
      }
    });
  }

  /* ----------------------------------------------------------
     3. Ombre du header au défilement
     ---------------------------------------------------------- */
  const header = document.querySelector('.site-header');

  function gererOmbreHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }

  if (header) {
    window.addEventListener('scroll', gererOmbreHeader, { passive: true });
    gererOmbreHeader();
  }

  /* ----------------------------------------------------------
     4. Apparition au scroll
     ---------------------------------------------------------- */
  const elementsAnimes = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observateur = new IntersectionObserver(
      (entrees, obs) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) {
            entree.target.classList.add('is-visible');
            obs.unobserve(entree.target); // on n'anime qu'une fois
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elementsAnimes.forEach((el) => observateur.observe(el));
  } else {
    // Navigateur ancien ou animations réduites : tout est visible directement
    elementsAnimes.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------
     5. Compteurs animés (chiffres clés)
     ---------------------------------------------------------- */

  /**
   * Fait défiler un nombre de 0 jusqu'à sa valeur cible.
   * @param {HTMLElement} el - élément contenant le nombre
   * @param {number} cible - valeur finale
   * @param {number} duree - durée de l'animation en ms
   */
  function animerCompteur(el, cible, duree = 1600) {
    const debut = performance.now();

    function frame(maintenant) {
      const progression = Math.min((maintenant - debut) / duree, 1);
      // Accélération douce en fin de course (ease-out)
      const valeur = Math.round(cible * (1 - Math.pow(1 - progression, 3)));
      el.textContent = valeur;
      if (progression < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  const compteurs = document.querySelectorAll('.stat-number[data-target]');

  if (compteurs.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      const observateurCompteurs = new IntersectionObserver(
        (entrees, obs) => {
          entrees.forEach((entree) => {
            if (entree.isIntersecting) {
              const el = entree.target;
              animerCompteur(el, Number(el.dataset.target));
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      compteurs.forEach((el) => observateurCompteurs.observe(el));
    } else {
      // Pas d'animation : on affiche directement la valeur finale
      compteurs.forEach((el) => {
        el.textContent = el.dataset.target;
      });
    }
  }

  /* ----------------------------------------------------------
     6. Validation du formulaire de contact
     ---------------------------------------------------------- */
  const formulaire = document.getElementById('formulaire-contact');

  /**
   * Règles de validation par champ.
   * Chaque fonction renvoie un message d'erreur, ou une chaîne vide si valide.
   */
  const regles = {
    nom: (valeur) => {
      if (!valeur.trim()) return 'Merci de renseigner votre nom.';
      if (valeur.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères.';
      return '';
    },
    email: (valeur) => {
      if (!valeur.trim()) return 'Merci de renseigner votre adresse email.';
      // Vérification simple : texte@texte.domaine
      const motif = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return motif.test(valeur.trim()) ? '' : 'Adresse email invalide (ex. nom@domaine.fr).';
    },
    telephone: (valeur) => {
      if (!valeur.trim()) return ''; // facultatif
      const motif = /^[+\d][\d\s.-]{6,19}$/;
      return motif.test(valeur.trim()) ? '' : 'Numéro de téléphone invalide.';
    },
    sujet: (valeur) => (valeur ? '' : 'Merci de choisir un type de projet.'),
    message: (valeur) => {
      if (!valeur.trim()) return 'Merci d\'écrire votre message.';
      if (valeur.trim().length < 10) return 'Votre message doit contenir au moins 10 caractères.';
      return '';
    },
  };

  /**
   * Affiche ou efface l'erreur d'un champ.
   * @param {HTMLElement} champ - élément input, select ou textarea
   * @returns {boolean} true si le champ est valide
   */
  function validerChamp(champ) {
    const regle = regles[champ.name];
    if (!regle) return true;

    const messageErreur = regle(champ.value);
    const conteneur = champ.closest('.field');
    const zoneErreur = document.getElementById('erreur-' + champ.name);

    zoneErreur.textContent = messageErreur;
    conteneur.classList.toggle('is-invalid', Boolean(messageErreur));
    conteneur.classList.toggle('is-valid', !messageErreur && champ.value.trim() !== '');
    champ.setAttribute('aria-invalid', String(Boolean(messageErreur)));

    return !messageErreur;
  }

  if (formulaire) {
    const champs = formulaire.querySelectorAll('input, select, textarea');
    const statut = document.getElementById('statut-formulaire');

    // Validation à la sortie du champ (blur) puis en continu après une première erreur
    champs.forEach((champ) => {
      champ.addEventListener('blur', () => validerChamp(champ));
      champ.addEventListener('input', () => {
        if (champ.closest('.field').classList.contains('is-invalid')) {
          validerChamp(champ);
        }
      });
    });

    formulaire.addEventListener('submit', (evenement) => {
      evenement.preventDefault();
      statut.textContent = '';
      statut.className = 'form-status';

      // Valider tous les champs
      let premierChampInvalide = null;
      champs.forEach((champ) => {
        const estValide = validerChamp(champ);
        if (!estValide && !premierChampInvalide) {
          premierChampInvalide = champ;
        }
      });

      if (premierChampInvalide) {
        // Le focus va sur le premier champ en erreur (accessibilité)
        premierChampInvalide.focus();
        statut.textContent = 'Veuillez corriger les champs signalés.';
        statut.classList.add('is-error');
        return;
      }

      // Envoi simulé : à remplacer par votre service (Formspree, API, etc.)
      const bouton = formulaire.querySelector('button[type="submit"]');
      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';

      setTimeout(() => {
        formulaire.reset();
        champs.forEach((champ) => {
          champ.closest('.field').classList.remove('is-valid', 'is-invalid');
          champ.removeAttribute('aria-invalid');
        });
        bouton.disabled = false;
        bouton.textContent = 'Envoyer ma demande';
        statut.textContent = 'Merci ! Votre demande a bien été envoyée. Nous vous répondons rapidement.';
        statut.classList.add('is-success');
      }, 800);
    });
  }
})();
