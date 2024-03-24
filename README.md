# TEST DRVIEN DEVELOPMENT

## Installation

npm run test: pour voir les resultats des tests en continue

## Type de test

- Unit test: une ligne de code très précise à tester -> trouvera de suite d'ou vient l'erreur
- feature test: un composant ou une fonctionnalité (bloc de code) à tester -> scope plus large mais on sera aussi d'ou vient l'erreur
- End to End: pour controler la user stories de notre app, décrit clairement les étapes de notre utilisateur -> plus long et moins précis

## Principe

On teste comportement et leur but

Feu rouge:

- Je décris et j'écris le test, ce que j'attends
- le test renvoie donc ROUGE

Feu vert:

- Je mets à jour mon component ou ma fonction pour que le test passe au vert
- Une fois résolu le test renvoie VERT

Refactoriser:

- Refactorise le composant ou la fonction
- Refactorise le fichier test

Enfin je commit

Le nom donnée au test, peut etre une description complète cela aide à 2 points

- Nommer les commits
- Sert à la documentation de notre application / projet

## Archi

### settings.ts

Permet d'exporter des const que je peux utiliser dans les components et dans son fichier test
+: plus facile à maintenir, pas besoin de changer dans les 2 fichiers
