-- =====================================================================
-- PrimROSE – Axe « Soutenir » : texte ouvert à toute personne
-- « à toute personne » au lieu de « aux victimes », « médical ou légal »,
-- « en toute confidentialité ». Ne s'applique que si le texte n'a pas déjà
-- été modifié depuis l'admin : rejouable et sans écrasement.
-- =====================================================================

update public.missions
  set description = 'Apporter un soutien psychologique, médical ou légal à toute personne.'
  where slug = 'soutenir'
    and description = 'Apporter un soutien psychologique, médical et légal aux victimes.';

update public.missions
  set detail = 'Toute personne accompagnée reçoit une écoute en toute confidentialité et une orientation vers les ressources psychologiques, médicales ou juridiques adaptées à sa situation.'
  where slug = 'soutenir'
    and detail = 'Chaque victime accompagnée reçoit une écoute confidentielle et une orientation vers les ressources psychologiques, médicales et juridiques adaptées à sa situation.';
