# authentification
Service d'authentification pour ManaMon

On peut communiquer avec le service `profile`, pour créer un nouveau profil lorsqu'un utilisateur se register sur notre service.

Pour générer les clés (dans le dossier /keys):
```
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key
```