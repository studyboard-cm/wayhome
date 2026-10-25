# WayHome : publier le site sur GitHub Pages

## 1. Structure du projet

```
wayhome/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── logo.png        ← à ajouter (votre logo WayHome)
└── GUIDE-GITHUB-PAGES.md
```

Tous les chemins sont relatifs : le site fonctionne donc à la racine d'un domaine
comme dans un sous-dossier (`https://votre-nom.github.io/wayhome/`).

## 2. Ajouter votre logo

1. Placez votre fichier logo dans le dossier `assets/` sous le nom `logo.png`.
2. Pour un rendu net, utilisez un PNG d'au moins 300 px de large (fond transparent).
3. Le logo apparaît dans le header et le footer. Sur le footer (fond navy), privilégiez une version claire ou blanche.

## 3. Créer le dépôt GitHub

1. Connectez-vous sur [github.com](https://github.com).
2. Cliquez sur **New repository**.
3. Nommez-le, par exemple `wayhome`, en mode **Public**.
4. Ne cochez pas « Add a README » (le projet en contient déjà un).

## 4. Envoyer les fichiers

Depuis le dossier du projet, dans un terminal :

```bash
git init
git add .
git commit -m "Premier envoi du site WayHome"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM/wayhome.git
git push -u origin main
```

## 5. Activer GitHub Pages

1. Ouvrez votre dépôt, puis **Settings** > **Pages**.
2. Dans **Build and deployment**, choisissez :
   - **Source** : *Deploy from a branch*
   - **Branch** : `main` et dossier `/ (root)`
3. Cliquez sur **Save**.
4. Après 1 à 2 minutes, l'adresse du site s'affiche : `https://VOTRE-NOM.github.io/wayhome/`.

## 6. Mettre à jour le site

Modifiez vos fichiers, puis :

```bash
git add .
git commit -m "Description de la modification"
git push
```

GitHub Pages republie automatiquement le site.

## 7. Points à personnaliser avant la mise en ligne

- **Coordonnées** : téléphone et email dans la section contact d'`index.html`.
- **Témoignages** : remplacez les exemples par de vrais témoignages avec l'accord des clients.
- **Chiffres clés** : modifiez les attributs `data-target` dans la section « À propos ».
- **Formulaire** : l'envoi est simulé dans `js/main.js`. Pour recevoir réellement les demandes, branchez un service comme Formspree ou Web3Forms sur la balise `<form>`.
- **Mentions légales** : ajoutez vos pages légales (le lien est en placeholder dans le footer).

## 8. Vérifications avant mise en ligne

- Tester le menu mobile et la navigation au clavier (touche Tab, Entrée, Échap).
- Vérifier le formulaire avec des champs vides et des emails invalides.
- Tester avec les réglages « réduire les animations » de votre système.
