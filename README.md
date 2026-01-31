# Supply Chain Management - Client

Application web Angular pour la gestion de la chaîne d'approvisionnement (Supply Chain Management). Cette application permet de gérer les inventaires, la production, les fournisseurs et les utilisateurs avec une authentification sécurisée via Keycloak.

## 🚀 Technologies

- **Angular 19.2.0** - Framework frontend
- **TypeScript 5.7.2** - Langage de programmation
- **Bootstrap 5.3.8** - Framework CSS
- **Bootstrap Icons 1.13.1** - Icônes
- **Keycloak Angular 13.1.0** - Authentification et autorisation
- **RxJS 7.8.0** - Programmation réactive
- **NGX Toastr 19.0.0** - Notifications

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18.x ou supérieure)
- **npm** (version 9.x ou supérieure)
- **Angular CLI** (version 19.2.19)
- **Keycloak Server** (version 26.x) en cours d'exécution sur `http://localhost:8082`
- **Backend API** en cours d'exécution sur `http://localhost:8080`

## 🔧 Installation

1. Clonez le repository :
```bash
git clone MouadHallaffou/supply-chain-client.git
cd supply-chain-client
```

2. Installez les dépendances :
```bash
npm install
```

3. Vérifiez la configuration dans `src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  keycloak: {
    realm: 'supply-chain',
    url: 'http://localhost:8082',
    clientId: 'supply-chain-client'
  }
};
```

## 🏃 Démarrage

### Serveur de développement

Lancez le serveur de développement :

```bash
ng serve
```

ou

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200/`. L'application se rechargera automatiquement à chaque modification du code source.

### Configuration Keycloak

Assurez-vous que Keycloak est configuré avec :
- **Realm** : `supply-chain`
- **Client ID** : `supply-chain-client`
- **Redirect URIs** : `http://localhost:4200/*`
- **Web Origins** : `http://localhost:4200`

## 🏗️ Structure du projet

```
supply-chain-client/
├── src/
│   ├── app/
│   │   ├── core/              # Services et intercepteurs globaux
│   │   │   ├── guards/        # Guards de navigation (AuthGuard)
│   │   │   ├── interceptors/  # Intercepteurs HTTP (AuthInterceptor)
│   │   │   └── services/      # Services d'authentification
│   │   ├── features/          # Modules fonctionnels
│   │   │   ├── dashboard/     # Tableau de bord
│   │   │   ├── inventory/     # Gestion des inventaires
│   │   │   │   ├── components/
│   │   │   │   │   ├── fournisseur-list/
│   │   │   │   │   ├── fournisseur-form/
│   │   │   │   │   ├── matiere-premiere-list/
│   │   │   │   │   ├── matiere-premiere-form/
│   │   │   │   │   ├── commande-fournisseur-list/
│   │   │   │   │   └── commande-fournisseur-form/
│   │   │   │   ├── models/
│   │   │   │   └── services/
│   │   │   ├── production/    # Gestion de la production
│   │   │   │   ├── components/
│   │   │   │   │   ├── product-list/
│   │   │   │   │   ├── product-form/
│   │   │   │   │   ├── product-order-list/
│   │   │   │   │   └── bill-of-material/
│   │   │   │   ├── models/
│   │   │   │   └── services/
│   │   │   └── user-management/ # Gestion des utilisateurs
│   │   ├── layout/            # Composants de mise en page
│   │   │   ├── main-layout/
│   │   │   └── auth-layout/
│   │   └── shared/            # Composants partagés
│   │       ├── components/
│   │       │   ├── header/
│   │       │   ├── sidebar/
│   │       │   └── navbar/
│   │       └── directives/
│   └── environments/          # Configuration par environnement
├── docs/                      # Documentation
└── public/                    # Assets statiques
```

## 🎯 Fonctionnalités

### Modules principaux

1. **Dashboard** - Vue d'ensemble des statistiques et activités
2. **Inventory Management** 
   - Gestion des fournisseurs
   - Gestion des matières premières
   - Gestion des commandes fournisseurs
3. **Production Management**
   - Gestion des produits
   - Gestion des ordres de production
   - Gestion des nomenclatures (BOM)
4. **UserModel Management** - Gestion des utilisateurs et rôles

### Sécurité

- Authentification via Keycloak SSO
- Gestion des rôles et permissions
- Protection des routes avec AuthGuard
- Interception et ajout automatique du token JWT

## 🔨 Build

Pour créer une version de production :

```bash
ng build
```

Les fichiers de build seront générés dans le répertoire `dist/`. La build de production optimise automatiquement l'application pour les performances.

Pour une build avec configuration spécifique :

```bash
ng build --configuration production
```

## 🧪 Tests

### Tests unitaires

Exécutez les tests unitaires avec Karma :

```bash
ng test
```

### Tests de couverture

Pour générer un rapport de couverture :

```bash
ng test --code-coverage
```

Le rapport sera généré dans `coverage/`.

## 📦 Scripts NPM disponibles

```bash
npm start          # Démarre le serveur de développement
npm run build      # Build de production
npm run watch      # Build en mode watch
npm test           # Lance les tests unitaires
```

## 🎨 Conventions de code

- Utilisez les **standalone components** (composants autonomes)
- Suivez les **signals** Angular pour la gestion d'état
- Utilisez **RxJS** pour les opérations asynchrones
- Respectez le **style guide Angular**
- Utilisez **TypeScript strict mode**

## 🔑 Variables d'environnement

Modifiez `src/environments/environment.ts` pour la configuration de développement et `src/environments/environment.prod.ts` pour la production.

## 🐛 Débogage

Pour déboguer l'application :

1. Ouvrez les DevTools du navigateur (F12)
2. Consultez l'onglet Console pour les logs
3. Utilisez l'extension Angular DevTools pour Chrome/Edge
4. Vérifiez les requêtes réseau dans l'onglet Network

## 📝 Logs Keycloak

Les logs d'initialisation Keycloak apparaissent dans la console :
- URL Keycloak
- Realm
- Client ID
- Statut d'authentification
- Rôles utilisateur

## 🤝 Contribution

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
2. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
3. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
4. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence privée.

## 🔗 Liens utiles

- [Angular Documentation](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3)
- [RxJS Documentation](https://rxjs.dev)

## 📞 Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.
