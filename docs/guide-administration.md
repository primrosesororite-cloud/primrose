# Guide d'administration — Primrose, La Sororité Active

Guide simple pour l'équipe de l'association. Aucune connaissance technique n'est nécessaire.

## Se connecter

1. Allez sur `https://<votre-domaine>/connexion`.
2. Entrez votre adresse e-mail et votre mot de passe.
3. Vous arrivez sur le tableau de bord de l'administration (`/admin`).

**Vos accès dépendent de votre rôle** :

| Rôle | Ce que vous pouvez faire |
|---|---|
| **Super administrateur** | Tout, y compris créer et gérer les comptes des autres membres |
| **Administrateur** | Gérer les contenus **et** les demandes (adhésions, contact, aide) |
| **Éditeur** | Gérer uniquement les contenus (pas d'accès aux demandes reçues) |

Si un menu de ce guide n'apparaît pas dans votre tableau de bord, c'est normal : il est réservé à un autre rôle.

## Vue d'ensemble du menu

- **Contenus du site** : pages, missions, valeurs, équipe, partenaires
- **Formations** : catalogue et inscriptions
- **Actualités et événements**
- **Demandes reçues** : adhésions, messages de contact, demandes d'aide
- **Médiathèque** : images utilisées sur le site
- **Paramètres** : réseaux sociaux, numéros d'urgence, coordonnées
- **Utilisateurs** *(super administrateur uniquement)*
- **Journal d'activité** *(super administrateur uniquement)*

## Gérer les contenus

Chaque module suit le même principe :

1. Une **liste** de tous les éléments, avec recherche et filtres en haut.
2. Un bouton **« Ajouter »** pour créer un nouvel élément.
3. Cliquer sur un élément pour le **modifier**.
4. Une icône de suppression, qui **demande toujours confirmation** avant d'effacer quoi que ce soit.

Pour les **missions** et **valeurs**, vous pouvez réorganiser l'ordre d'affichage en glissant-déposant les lignes de la liste.

Pour les **actualités**, l'éditeur de texte permet de mettre en forme (gras, titres, liens, images) sans connaître de code. Vous pouvez enregistrer un brouillon, publier immédiatement, ou **programmer** la publication à une date future.

⚠️ **Chaque image ajoutée doit avoir une description (« texte alternatif »)** — c'est ce que lisent les personnes malvoyantes utilisant un lecteur d'écran, et ce que lit Google pour référencer l'image. Une description courte et concrète suffit (ex. « Groupe de femmes lors d'un atelier de formation »).

## Formations

- Créez une formation (titre, description, date, lieu, nombre de places).
- Les inscriptions arrivent automatiquement dans l'onglet **Inscriptions** de la formation.
- Bouton **« Exporter en CSV »** pour obtenir la liste des inscrits dans un fichier ouvrable avec Excel.

## Demandes reçues

### Adhésions et messages de contact

Ces demandes s'affichent dans une liste. Cliquez sur une demande pour voir le détail et **répondre directement par e-mail** depuis l'interface — la réponse part depuis l'adresse de l'association, pas depuis votre boîte personnelle.

### Demandes d'aide — module sensible

Ce module est réservé aux rôles **administrateur** et **super administrateur**.

- Les coordonnées et messages des personnes sont **chiffrés** : ils ne sont lisibles qu'en ouvrant la demande dans l'admin, jamais dans un e-mail ni ailleurs.
- **Chaque consultation d'une demande est enregistrée** dans le journal d'activité (qui a consulté quoi, et quand) — c'est une mesure de protection des personnes qui ont fait la demande, pas une surveillance de l'équipe.
- Si une demande est marquée **urgente**, un e-mail d'alerte est envoyé automatiquement à l'équipe — **cet e-mail ne contient jamais** les coordonnées ni le message de la personne (pour ne rien exposer si la boîte mail est compromise). Il faut se connecter à l'admin pour voir le contenu.
- La personne peut avoir indiqué **« ne pas me contacter avant telle date »** — cette information s'affiche en évidence sur la demande ; il faut impérativement la respecter avant tout contact, pour la sécurité de la personne (par exemple si son téléphone est surveillé par un conjoint).
- Ne partagez jamais le contenu d'une demande d'aide en dehors de l'admin (pas de capture d'écran envoyée par messagerie, pas d'impression laissée visible).

## Médiathèque

Toutes les images utilisées sur le site. Vous pouvez :
- Importer de nouvelles images (elles sont automatiquement compressées).
- Renseigner ou modifier la description (texte alternatif) de chaque image — **obligatoire**.
- Supprimer une image inutilisée (une confirmation est toujours demandée).

## Paramètres

- **Numéros d'urgence** affichés sur la page « Besoin d'aide » — à vérifier régulièrement, une erreur ici a des conséquences graves pour une personne en danger.
- **Réseaux sociaux** : liens affichés dans le pied de page du site.
- **Coordonnées générales** de l'association.

## Utilisateurs *(super administrateur)*

- **Inviter** un nouveau membre : renseignez son e-mail et son rôle, un lien d'invitation lui est envoyé.
- **Modifier le rôle** d'un membre existant.
- **Désactiver** un compte (par exemple, un membre qui quitte l'association) plutôt que le supprimer — cela conserve l'historique sans laisser d'accès actif.

## Journal d'activité *(super administrateur)*

Historique de qui a fait quoi dans l'administration (créations, modifications, suppressions, et consultations de demandes d'aide). Utile pour comprendre un changement inattendu ou vérifier qu'une demande sensible a bien été traitée par la bonne personne.

## Bon réflexe en cas de doute

En cas de question, de comportement inhabituel du site, ou de doute sur une demande reçue, contactez la personne technique en charge du site avant d'agir — en particulier pour tout ce qui touche au module « Demandes d'aide ».
