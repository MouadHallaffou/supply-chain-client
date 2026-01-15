# Angular 19 - Documentation Complète

## Table des Matières

1. [TypeScript Fondamentaux](#1-typescript-fondamentaux)
2. [Core Concepts Angular](#2-core-concepts-angular)
3. [Signals (Angular 19)](#3-signals-angular-19)
4. [Dependency Injection](#4-dependency-injection)
5. [Routing](#5-routing)
6. [Forms](#6-forms)
7. [HTTP & Services](#7-http--services)
8. [Lifecycle Hooks](#8-lifecycle-hooks)

---

## 1. TypeScript Fondamentaux

### 1.1 Types et Interfaces

TypeScript ajoute un système de types statiques à JavaScript pour détecter les erreurs avant l'exécution.

```typescript
// Types primitifs
let username: string = "John";
let age: number = 25;
let isActive: boolean = true;
let data: any = "peut être n'importe quoi"; // À éviter

// Arrays
let numbers: number[] = [1, 2, 3, 4];
let names: Array<string> = ["Alice", "Bob"];

// Tuple (tableau avec types fixes)
let user: [string, number] = ["John", 25];

// Enum
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

let role: UserRole = UserRole.ADMIN;

// Union types
let id: string | number = 123;
id = "ABC123"; // Valide aussi

// Literal types
let status: 'pending' | 'approved' | 'rejected' = 'pending';
```

**Interfaces** : Définissent la structure d'un objet

```typescript
// Interface simple
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;           // Propriété optionnelle
  readonly createdAt: Date; // Propriété en lecture seule
}

// Utilisation
const user: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  createdAt: new Date()
};

// Interface avec méthodes
interface Product {
  id: number;
  name: string;
  price: number;

  calculateDiscount(percentage: number): number;
}

// Interface héritant d'une autre
interface Employee extends User {
  employeeId: string;
  department: string;
  salary: number;
}

// Type Alias (alternative aux interfaces)
type Address = {
  street: string;
  city: string;
  zipCode: string;
};
```

### 1.2 Classes et Héritage

```typescript
// Classe de base
class Person {
  // Propriétés
  private id: number;           // Accessible uniquement dans la classe
  protected name: string;       // Accessible dans la classe et ses héritiers
  public age: number;           // Accessible partout (par défaut)

  // Constructeur
  constructor(id: number, name: string, age: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }

  // Méthode
  introduce(): string {
    return `Je m'appelle ${this.name} et j'ai ${this.age} ans`;
  }

  // Getter
  get personId(): number {
    return this.id;
  }

  // Setter
  set personAge(value: number) {
    if (value > 0) {
      this.age = value;
    }
  }
}

// Héritage
class Employee extends Person {
  private salary: number;

  constructor(id: number, name: string, age: number, salary: number) {
    super(id, name, age); // Appel du constructeur parent
    this.salary = salary;
  }

  // Override de méthode
  introduce(): string {
    return `${super.introduce()} et je suis employé`;
  }

  getSalary(): number {
    return this.salary;
  }
}

// Utilisation
const emp = new Employee(1, "Alice", 30, 50000);
console.log(emp.introduce()); // "Je m'appelle Alice et j'ai 30 ans et je suis employé"
```

**Syntaxe courte pour le constructeur** :

```typescript
class Product {
  // Propriétés déclarées directement dans le constructeur
  constructor(
    public id: number,
    public name: string,
    private price: number
  ) {
  }

  getPrice(): number {
    return this.price;
  }
}

const product = new Product(1, "Laptop", 1200);
console.log(product.name); // "Laptop"
```

### 1.3 Decorators

Les décorateurs sont des fonctions qui modifient le comportement des classes, méthodes ou propriétés.

```typescript
// Décorateur de classe
function Component(config: any) {
  return function (target: any) {
    console.log('Composant créé avec config:', config);
  }
}

@Component({
  selector: 'app-root',
  template: '<h1>Hello</h1>'
})
class AppComponent {
}

// Décorateur de propriété
function ReadOnly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class Configuration {
  @ReadOnly
  apiUrl: string = "https://api.example.com";
}

// Décorateur de méthode
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Appel de ${propertyKey} avec`, args);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

### 1.4 Async/Await et Promises

**Promises** : Représentent une valeur future (succès ou échec)

```typescript
// Création d'une Promise
function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({id, name: "John", email: "john@test.com"});
      } else {
        reject(new Error("ID invalide"));
      }
    }, 1000);
  });
}

// Utilisation avec .then()
fetchUser(1)
  .then(user => {
    console.log("User:", user);
  })
  .catch(error => {
    console.error("Erreur:", error);
  });

// Utilisation avec async/await
async function getUser() {
  try {
    const user = await fetchUser(1);
    console.log("User:", user);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Plusieurs Promises en parallèle
async function loadData() {
  try {
    const [users, products, orders] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
      fetchOrders()
    ]);

    console.log({users, products, orders});
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
  }
}
```

### 1.5 Génériques

Les génériques permettent de créer des composants réutilisables qui fonctionnent avec différents types.

```typescript
// Fonction générique
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("Hello"); // Type explicite
let output2 = identity(42);              // Type inféré

// Interface générique
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: {id: 1, name: "John", email: "john@test.com"},
  status: 200,
  message: "Success"
};

// Classe générique
class DataStore<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }

  findById(id: number): T | undefined {
    return this.items.find((item: any) => item.id === id);
  }
}

// Utilisation
const userStore = new DataStore<User>();
userStore.add({id: 1, name: "Alice", email: "alice@test.com"});

const productStore = new DataStore<Product>();
productStore.add({id: 1, name: "Laptop", price: 1200});

// Contraintes génériques
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}
```

---

## 2. Core Concepts Angular

### 2.1 Qu'est-ce qu'une SPA ?

**SPA (Single Page Application)** : Application web qui charge une seule page HTML et met à jour dynamiquement le contenu sans recharger la page entière.

**Avantages** :

- ✅ Navigation fluide et rapide
- ✅ Meilleure expérience utilisateur
- ✅ Moins de requêtes serveur
- ✅ Séparation frontend/backend

**Fonctionnement** :

1. Le serveur envoie `index.html` + fichiers JS/CSS
2. Angular prend le contrôle de la page
3. Le routeur Angular gère la navigation
4. Les données sont chargées via des API REST

```
Navigateur                    Serveur
    |                            |
    |---(1) GET / ------------->|
    |<--index.html + app.js-----|
    |                            |
    |---(2) Navigation interne-->| (pas de requête)
    |                            |
    |---(3) GET /api/users----->|
    |<--JSON data---------------|
```

### 2.2 Architecture Angular

**Structure d'une application Angular** :

```
src/
├── app/
│   ├── core/              (Services singleton, guards, interceptors)
│   ├── shared/            (Composants, directives, pipes partagés)
│   ├── features/          (Modules fonctionnels)
│   ├── app.component.ts   (Composant racine)
│   ├── app.routes.ts      (Configuration des routes)
│   └── app.config.ts      (Configuration de l'app)
├── assets/                (Images, fichiers statiques)
├── environments/          (Configuration environnement)
├── index.html             (Page HTML principale)
└── main.ts                (Point d'entrée)
```

**Flux de démarrage** :

```
1. main.ts → bootstrapApplication(AppComponent)
2. AppComponent est chargé dans index.html
3. Le routeur Angular charge les composants selon l'URL
4. Les composants affichent leurs templates
```

### 2.3 Composants

Un **composant** est une classe TypeScript avec un décorateur `@Component` qui contrôle une partie de l'interface utilisateur.

**Composant simple** :

```typescript
// hello.component.ts
import {Component} from '@angular/core';

@Component({
  selector: 'app-hello',        // Nom du tag HTML
  standalone: true,              // Composant standalone (Angular 19)
  template: `
    <div class="greeting">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .greeting {
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    h1 {
      color: #333;
    }
  `]
})
export class HelloComponent {
  title = 'Bienvenue';
  message = 'Voici mon premier composant Angular !';
}
```

**Utilisation dans un autre composant** :

```typescript
// app.component.ts
import {Component} from '@angular/core';
import {HelloComponent} from './hello.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HelloComponent],  // Import du composant
  template: `
    <app-hello></app-hello>
  `
})
export class AppComponent {
}
```

**Composant avec fichiers séparés** :

```typescript
// user-card.component.ts
import {Component} from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'assets/avatar.jpg'
  };
}
```

```html
<!-- user-card.component.html -->
<div class="user-card">
  <img [src]="user.avatar" [alt]="user.name">
  <h3>{{ user.name }}</h3>
  <p>{{ user.email }}</p>
</div>
```

```css
/* user-card.component.css */
.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
}

.user-card img {
  width: 100%;
  border-radius: 50%;
}
```

### 2.4 Templates HTML Angular

Les templates Angular sont du HTML enrichi avec des syntaxes spéciales.

**Syntaxe de base** :

```html
<!-- Interpolation -->
<h1>{{ title }}</h1>
<p>{{ 2 + 2 }}</p>
<p>{{ user.name.toUpperCase() }}</p>

<!-- Property Binding -->
<img [src]="imageUrl" [alt]="description">
<button [disabled]="isLoading">Cliquer</button>
<div [class.active]="isActive">Contenu</div>
<div [style.color]="textColor">Texte coloré</div>

<!-- Event Binding -->
<button (click)="handleClick()">Cliquer</button>
<input (keyup)="onKeyUp($event)">
<form (submit)="onSubmit($event)">

  <!-- Two-way Binding -->
  <input [(ngModel)]="username">

  <!-- Template Reference Variable -->
  <input #nameInput type="text">
  <button (click)="greet(nameInput.value)">Saluer</button>

  <!-- Directives structurelles -->
  <div *ngIf="isVisible">Visible si vrai</div>
  <ul>
    <li *ngFor="let item of items; let i = index">
      {{ i + 1 }}. {{ item }}
    </li>
  </ul>

  <!-- Pipes -->
  <p>{{ today | date:'fullDate' }}</p>
  <p>{{ price | currency:'EUR' }}</p>
  <p>{{ name | uppercase }}</p>
```

### 2.5 Data Binding

Angular offre 4 types de data binding pour synchroniser les données entre le composant et la vue.

#### 2.5.1 Interpolation `{{ }}`

Affiche les données du composant dans le template.

```typescript

@Component({
  template: `
    <h1>{{ title }}</h1>
    <p>L'utilisateur {{ user.name }} a {{ user.age }} ans</p>
    <p>Prix total: {{ price * quantity }}</p>
  `
})
export class ExampleComponent {
  title = 'Mon Application';
  user = {name: 'Alice', age: 25};
  price = 100;
  quantity = 3;
}
```

#### 2.5.2 Property Binding `[property]`

Lie une propriété d'élément HTML à une expression du composant.

```typescript

@Component({
  template: `
    <!-- Attributs standards -->
    <img [src]="imageUrl" [alt]="imageAlt">
    <button [disabled]="isDisabled">Envoyer</button>
    <a [href]="link" [title]="linkTitle">Lien</a>

    <!-- Classes CSS -->
    <div [class.active]="isActive">Active</div>
    <div [class]="dynamicClass">Classe dynamique</div>
    <div [ngClass]="{
      'active': isActive,
      'disabled': isDisabled,
      'error': hasError
    }">Multi-classes</div>

    <!-- Styles inline -->
    <p [style.color]="textColor">Texte</p>
    <p [style.font-size.px]="fontSize">Taille de police</p>
    <div [ngStyle]="{
      'color': textColor,
      'font-size': fontSize + 'px',
      'background-color': bgColor
    }">Multi-styles</div>

    <!-- Propriétés de composants -->
    <app-user-card [user]="currentUser"></app-user-card>
  `
})
export class BindingComponent {
  imageUrl = 'assets/logo.png';
  imageAlt = 'Logo';
  isDisabled = false;
  link = 'https://angular.io';
  linkTitle = 'Documentation Angular';

  isActive = true;
  hasError = false;
  dynamicClass = 'highlight';

  textColor = '#ff0000';
  fontSize = 16;
  bgColor = '#f0f0f0';

  currentUser = {name: 'John', email: 'john@test.com'};
}
```

#### 2.5.3 Event Binding `(event)`

Écoute les événements DOM et exécute des méthodes du composant.

```typescript

@Component({
  template: `
    <!-- Événements standards -->
    <button (click)="handleClick()">Cliquer</button>
    <button (dblclick)="handleDoubleClick()">Double-clic</button>
    
    <!-- Événements de souris -->
    <div 
      (mouseenter)="onMouseEnter()" 
      (mouseleave)="onMouseLeave()">
      Survolez-moi
    </div>
    
    <!-- Événements de clavier -->
    <input 
      (keyup)="onKeyUp($event)"
      (keyup.enter)="onEnter()"
      (keyup.escape)="onEscape()">
    
    <!-- Événements de formulaire -->
    <form (submit)="onSubmit($event)">
      <input (input)="onInput($event)" (change)="onChange($event)">
      <button type="submit">Envoyer</button>
    </form>
    
    <!-- Événements personnalisés -->
    <app-button (btnClick)="handleCustomEvent($event)"></app-button>
    
    <!-- Passer des données -->
    <button (click)="selectItem(item)">{{ item.name }}</button>
    <button (click)="deleteItem(item.id)">Supprimer</button>
    
    <!-- Event object -->
    <input (keyup)="logKey($event)">
  `
})
export class EventComponent {
  handleClick() {
    console.log('Bouton cliqué !');
  }

  handleDoubleClick() {
    console.log('Double-clic détecté');
  }

  onMouseEnter() {
    console.log('Souris entrée');
  }

  onMouseLeave() {
    console.log('Souris sortie');
  }

  onKeyUp(event: KeyboardEvent) {
    console.log('Touche pressée:', (event.target as HTMLInputElement).value);
  }

  onEnter() {
    console.log('Entrée pressée');
  }

  onEscape() {
    console.log('Échap pressée');
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Formulaire soumis');
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Valeur actuelle:', value);
  }

  onChange(event: Event) {
    console.log('Valeur changée');
  }

  selectItem(item: any) {
    console.log('Item sélectionné:', item);
  }

  deleteItem(id: number) {
    console.log('Supprimer item:', id);
  }

  logKey(event: KeyboardEvent) {
    console.log('Key:', event.key, 'Code:', event.code);
  }
}
```

#### 2.5.4 Two-Way Binding `[(ngModel)]`

Synchronisation bidirectionnelle entre le composant et la vue.

```typescript
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-two-way-example',
  standalone: true,
  imports: [FormsModule], // IMPORTANT: Import FormsModule
  template: `
    <!-- Input texte -->
    <input [(ngModel)]="username" placeholder="Nom d'utilisateur">
    <p>Vous avez tapé: {{ username }}</p>
    
    <!-- Checkbox -->
    <label>
      <input type="checkbox" [(ngModel)]="isAgreed">
      J'accepte les conditions
    </label>
    <p>Statut: {{ isAgreed ? 'Accepté' : 'Non accepté' }}</p>
    
    <!-- Radio buttons -->
    <div>
      <label>
        <input type="radio" [(ngModel)]="gender" value="M">
        Homme
      </label>
      <label>
        <input type="radio" [(ngModel)]="gender" value="F">
        Femme
      </label>
    </div>
    <p>Genre sélectionné: {{ gender }}</p>
    
    <!-- Select -->
    <select [(ngModel)]="selectedCountry">
      <option value="">Choisir un pays</option>
      <option value="MA">Maroc</option>
      <option value="FR">France</option>
      <option value="US">USA</option>
    </select>
    <p>Pays: {{ selectedCountry }}</p>
    
    <!-- Textarea -->
    <textarea [(ngModel)]="description" rows="4"></textarea>
    <p>Description ({{ description.length }} caractères)</p>
    
    <!-- Exemple complet: Formulaire -->
    <div class="form">
      <input [(ngModel)]="user.name" placeholder="Nom">
      <input [(ngModel)]="user.email" type="email" placeholder="Email">
      <input [(ngModel)]="user.age" type="number" placeholder="Âge">
      
      <div class="preview">
        <h3>Aperçu</h3>
        <p>Nom: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Âge: {{ user.age }}</p>
      </div>
    </div>
  `
})
export class TwoWayExampleComponent {
  username = '';
  isAgreed = false;
  gender = 'M';
  selectedCountry = '';
  description = '';

  user = {
    name: '',
    email: '',
    age: 0
  };
}
```

**Two-Way Binding manuel** (sans ngModel) :

```typescript

@Component({
  template: `
    <!-- Équivalent de [(ngModel)]="value" -->
    <input 
      [value]="value" 
      (input)="value = $any($event.target).value">
    
    <!-- Avec méthode -->
    <input 
      [value]="email" 
      (input)="onEmailChange($event)">
  `
})
export class ManualBindingComponent {
  value = '';
  email = '';

  onEmailChange(event: Event) {
    this.email = (event.target as HTMLInputElement).value;
  }
}
```

### 2.6 @Input / @Output

Communication entre composants parent et enfant.

#### 2.6.1 @Input (Parent → Enfant)

```typescript
// Composant enfant
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <span class="badge" [class.active]="isActive">
        {{ isActive ? 'Actif' : 'Inactif' }}
      </span>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: { name: string; email: string; };
  @Input() isActive: boolean = false;
  @Input({required: true}) userId!: number; // Input requis (Angular 16+)
}

// Composant parent
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent],
  template: `
    <app-user-card 
      [user]="currentUser" 
      [isActive]="true"
      [userId]="1">
    </app-user-card>
    
    <div *ngFor="let u of users">
      <app-user-card 
        [user]="u" 
        [isActive]="u.active"
        [userId]="u.id">
      </app-user-card>
    </div>
  `
})
export class UserListComponent {
  currentUser = {name: 'Alice', email: 'alice@test.com'};

  users = [
    {id: 1, name: 'Bob', email: 'bob@test.com', active: true},
    {id: 2, name: 'Charlie', email: 'charlie@test.com', active: false}
  ];
}
```

**Alias pour @Input** :

```typescript

@Component({
  selector: 'app-product',
  template: `<p>{{ productName }}</p>`
})
export class ProductComponent {
  @Input('name') productName!: string; // Utilise 'name' dans le template parent
}

// Utilisation
// <app-product [name]="'Laptop'"></app-product>
```

#### 2.6.2 @Output / EventEmitter (Enfant → Parent)

```typescript
// Composant enfant
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter">
      <button (click)="decrement()">-</button>
      <span>{{ count }}</span>
      <button (click)="increment()">+</button>
      <button (click)="reset()">Reset</button>
    </div>
  `
})
export class CounterComponent {
  @Input() count: number = 0;
  @Output() countChange = new EventEmitter<number>();
  @Output() onReset = new EventEmitter<void>();

  increment() {
    this.count++;
    this.countChange.emit(this.count); // Émet la nouvelle valeur
  }

  decrement() {
    this.count--;
    this.countChange.emit(this.count);
  }

  reset() {
    this.count = 0;
    this.countChange.emit(this.count);
    this.onReset.emit(); // Émet un événement sans données
  }
}

// Composant parent
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CounterComponent],
  template: `
    <h2>Compteur total: {{ totalCount }}</h2>
    
    <app-counter 
      [count]="totalCount"
      (countChange)="onCountChange($event)"
      (onReset)="handleReset()">
    </app-counter>
    
    <p>Le compteur a été modifié {{ changeCount }} fois</p>
  `
})
export class ParentComponent {
  totalCount = 0;
  changeCount = 0;

  onCountChange(newCount: number) {
    this.totalCount = newCount;
    this.changeCount++;
    console.log('Nouveau compteur:', newCount);
  }

  handleReset() {
    console.log('Compteur réinitialisé !');
    this.changeCount = 0;
  }
}
```

**Exemple complet: Formulaire de recherche** :

```typescript
// search-bar.component.ts (Enfant)
import {Component, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
      <input 
        [(ngModel)]="searchTerm" 
        (keyup.enter)="search()"
        placeholder="Rechercher...">
      <button (click)="search()">🔍</button>
      <button (click)="clear()">✖</button>
    </div>
  `
})
export class SearchBarComponent {
  searchTerm = '';
  @Output() onSearch = new EventEmitter<string>();
  @Output() onClear = new EventEmitter<void>();

  search() {
    if (this.searchTerm.trim()) {
      this.onSearch.emit(this.searchTerm);
    }
  }

  clear() {
    this.searchTerm = '';
    this.onClear.emit();
  }
}

// product-list.component.ts (Parent)
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [SearchBarComponent, CommonModule],
  template: `
    <app-search-bar 
      (onSearch)="handleSearch($event)"
      (onClear)="handleClear()">
    </app-search-bar>
    
    <div *ngFor="let product of filteredProducts">
      {{ product.name }} - {{ product.price }}€
    </div>
  `
})
export class ProductListComponent {
  products = [
    {id: 1, name: 'Laptop', price: 1200},
    {id: 2, name: 'Mouse', price: 25},
    {id: 3, name: 'Keyboard', price: 80}
  ];

  filteredProducts = [...this.products];

  handleSearch(term: string) {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  handleClear() {
    this.filteredProducts = [...this.products];
  }
}
```

---

## 2.7 Directives

Les directives sont des instructions qui modifient le DOM ou le comportement des éléments.

#### 2.7.1 Directives Structurelles

**ngIf** : Affiche/masque conditionnellement des éléments

```typescript

@Component({
  template: `
    <!-- Simple condition -->
    <div *ngIf="isLoggedIn">
      Bienvenue, utilisateur connecté !
    </div>
    
    <!-- Avec else -->
    <div *ngIf="isAdmin; else notAdmin">
      Panneau d'administration
    </div>
    <ng-template #notAdmin>
      <div>Accès refusé</div>
    </ng-template>
    
    <!-- Avec then et else -->
    <div *ngIf="user; then userBlock else guestBlock"></div>
    <ng-template #userBlock>
      <p>Bonjour {{ user.name }}</p>
    </ng-template>
    <ng-template #guestBlock>
      <p>Veuillez vous connecter</p>
    </ng-template>
    
    <!-- Avec variable locale -->
    <div *ngIf="currentUser$ | async as user">
      {{ user.name }} - {{ user.email }}
    </div>
    
    <!-- Conditions multiples -->
    <div *ngIf="isLoggedIn && hasPermission">
      Contenu protégé
    </div>
  `
})
export class DirectiveExampleComponent {
  isLoggedIn = true;
  isAdmin = false;
  user = {name: 'Alice', email: 'alice@test.com'};
  hasPermission = true;
}
```

**ngFor** : Boucle sur une collection

```typescript

@Component({
  template: `
    <!-- Boucle simple -->
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
    
    <!-- Avec index -->
    <ul>
      <li *ngFor="let item of items; let i = index">
        {{ i + 1 }}. {{ item }}
      </li>
    </ul>
    
    <!-- Avec variables spéciales -->
    <div *ngFor="let user of users; 
                 let i = index;
                 let first = first;
                 let last = last;
                 let even = even;
                 let odd = odd">
      <div [class.first]="first" 
           [class.last]="last"
           [class.even]="even"
           [class.odd]="odd">
        {{ i }}. {{ user.name }}
      </div>
    </div>
    
    <!-- Avec trackBy (optimisation) -->
    <ul>
      <li *ngFor="let product of products; trackBy: trackByProductId">
        {{ product.name }} - {{ product.price }}€
      </li>
    </ul>
    
    <!-- Objets -->
    <div *ngFor="let user of users">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <span>Âge: {{ user.age }}</span>
    </div>
    
    <!-- Nested loops -->
    <div *ngFor="let category of categories">
      <h2>{{ category.name }}</h2>
      <ul>
        <li *ngFor="let product of category.products">
          {{ product.name }}
        </li>
      </ul>
    </div>
  `
})
export class NgForExampleComponent {
  items = ['Angular', 'React', 'Vue'];

  users = [
    {id: 1, name: 'Alice', email: 'alice@test.com', age: 25},
    {id: 2, name: 'Bob', email: 'bob@test.com', age: 30},
    {id: 3, name: 'Charlie', email: 'charlie@test.com', age: 28}
  ];

  products = [
    {id: 1, name: 'Laptop', price: 1200},
    {id: 2, name: 'Mouse', price: 25},
    {id: 3, name: 'Keyboard', price: 80}
  ];

  categories = [
    {
      name: 'Electronics',
      products: [
        {name: 'TV'},
        {name: 'Phone'}
      ]
    },
    {
      name: 'Furniture',
      products: [
        {name: 'Chair'},
        {name: 'Table'}
      ]
    }
  ];

  // TrackBy function pour optimiser le rendu
  trackByProductId(index: number, product: any): number {
    return product.id;
  }
}
```

**ngSwitch** : Affiche un élément parmi plusieurs options

```typescript

@Component({
  template: `
    <div [ngSwitch]="userRole">
      <div *ngSwitchCase="'admin'">
        Panneau Administrateur
      </div>
      <div *ngSwitchCase="'user'">
        Panneau Utilisateur
      </div>
      <div *ngSwitchCase="'guest'">
        Mode Invité
      </div>
      <div *ngSwitchDefault>
        Rôle inconnu
      </div>
    </div>
    
    <!-- Exemple avec statut -->
    <div [ngSwitch]="orderStatus">
      <p *ngSwitchCase="'pending'" class="status-pending">
        ⏳ En attente
      </p>
      <p *ngSwitchCase="'processing'" class="status-processing">
        🔄 En traitement
      </p>
      <p *ngSwitchCase="'shipped'" class="status-shipped">
        📦 Expédié
      </p>
      <p *ngSwitchCase="'delivered'" class="status-delivered">
        ✅ Livré
      </p>
      <p *ngSwitchDefault class="status-unknown">
        ❓ Statut inconnu
      </p>
    </div>
  `
})
export class NgSwitchExampleComponent {
  userRole = 'admin';
  orderStatus = 'processing';
}
```

#### 2.7.2 Directives d'Attributs

**ngClass** : Applique des classes CSS dynamiquement

```typescript

@Component({
  template: `
    <!-- Classe unique -->
    <div [ngClass]="'highlight'">Texte surligné</div>
    
    <!-- Classe conditionnelle -->
    <div [ngClass]="isActive ? 'active' : 'inactive'">
      Statut
    </div>
    
    <!-- Objet de classes -->
    <div [ngClass]="{
      'active': isActive,
      'disabled': isDisabled,
      'error': hasError,
      'success': isSuccess
    }">
      État multiple
    </div>
    
    <!-- Array de classes -->
    <div [ngClass]="['btn', 'btn-primary', size]">
      Bouton
    </div>
    
    <!-- Expression dynamique -->
    <div [ngClass]="getClasses()">
      Classes dynamiques
    </div>
  `,
  styles: [`
    .active { color: green; }
    .inactive { color: gray; }
    .disabled { opacity: 0.5; }
    .error { color: red; }
    .success { color: green; }
    .highlight { background: yellow; }
  `]
})
export class NgClassExampleComponent {
  isActive = true;
  isDisabled = false;
  hasError = false;
  isSuccess = true;
  size = 'large';

  getClasses() {
    return {
      'active': this.isActive,
      'large': this.size === 'large'
    };
  }
}
```

**ngStyle** : Applique des styles inline dynamiquement

```typescript

@Component({
  template: `
    <!-- Style unique -->
    <p [ngStyle]="{'color': textColor}">
      Texte coloré
    </p>
    
    <!-- Styles multiples -->
    <div [ngStyle]="{
      'color': textColor,
      'font-size': fontSize + 'px',
      'background-color': bgColor,
      'padding': '20px',
      'border-radius': '8px'
    }">
      Styles multiples
    </div>
    
    <!-- Avec unités -->
    <div [ngStyle]="{
      'width.px': width,
      'height.%': height,
      'margin.rem': margin
    }">
      Dimensions
    </div>
    
    <!-- Expression dynamique -->
    <div [ngStyle]="getStyles()">
      Styles dynamiques
    </div>
  `
})
export class NgStyleExampleComponent {
  textColor = '#ff0000';
  fontSize = 18;
  bgColor = '#f0f0f0';
  width = 200;
  height = 100;
  margin = 2;

  getStyles() {
    return {
      'color': this.isError ? 'red' : 'green',
      'font-weight': this.isBold ? 'bold' : 'normal'
    };
  }

  isError = false;
  isBold = true;
}
```

### 2.8 Pipes

Les pipes transforment les données dans les templates.

**Pipes intégrés** :

```typescript

@Component({
  template: `
    <!-- DatePipe -->
    <p>{{ today | date }}</p>
    <p>{{ today | date:'short' }}</p>
    <p>{{ today | date:'fullDate' }}</p>
    <p>{{ today | date:'dd/MM/yyyy' }}</p>
    <p>{{ today | date:'HH:mm:ss' }}</p>
    
    <!-- CurrencyPipe -->
    <p>{{ price | currency }}</p>
    <p>{{ price | currency:'EUR' }}</p>
    <p>{{ price | currency:'EUR':'symbol':'1.2-2' }}</p>
    
    <!-- DecimalPipe -->
    <p>{{ pi | number }}</p>
    <p>{{ pi | number:'1.2-4' }}</p>
    
    <!-- PercentPipe -->
    <p>{{ percentage | percent }}</p>
    <p>{{ percentage | percent:'1.2-2' }}</p>
    
    <!-- UpperCasePipe / LowerCasePipe -->
    <p>{{ name | uppercase }}</p>
    <p>{{ name | lowercase }}</p>
    
    <!-- TitleCasePipe -->
    <p>{{ 'hello world' | titlecase }}</p>
    
    <!-- SlicePipe -->
    <p>{{ text | slice:0:10 }}</p>
    <ul>
      <li *ngFor="let item of items | slice:0:3">{{ item }}</li>
    </ul>
    
    <!-- JsonPipe (pour debug) -->
    <pre>{{ user | json }}</pre>
    
    <!-- AsyncPipe (pour Observables) -->
    <p>{{ user$ | async }}</p>
    
    <!-- Chaînage de pipes -->
    <p>{{ today | date:'fullDate' | uppercase }}</p>
    <p>{{ price | currency:'EUR' | uppercase }}</p>
  `
})
export class PipesExampleComponent {
  today = new Date();
  price = 1234.56;
  pi = 3.14159265359;
  percentage = 0.75;
  name = 'John Doe';
  text = 'Lorem ipsum dolor sit amet';
  items = ['A', 'B', 'C', 'D', 'E'];
  user = {name: 'Alice', age: 25};
  user$ = of({name: 'Bob'}); // Observable
}
```

**Pipe personnalisé** :

```typescript
// truncate.pipe.ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) return '';

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + trail;
  }
}

// Utilisation
@Component({
  standalone: true,
  imports: [TruncatePipe],
  template: `
    <p>{{ longText | truncate }}</p>
    <p>{{ longText | truncate:20 }}</p>
    <p>{{ longText | truncate:30:'...' }}</p>
  `
})
export class MyComponent {
  longText = 'Ceci est un très long texte qui sera tronqué';
}
```

**Autres exemples de pipes personnalisés** :

```typescript
// filter.pipe.ts - Filtre un tableau
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false // Repipe à chaque détection de changement
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    return items.filter(item =>
      item[property].toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

// time-ago.pipe.ts - Temps relatif
@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    const now = new Date();
    const diff = now.getTime() - value.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `Il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`;
  }
}
```

### 2.9 Composants Réutilisables

Créer des composants génériques et réutilisables.

**Exemple: Bouton réutilisable** :

```typescript
// button.component.ts
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="buttonClasses"
      (click)="handleClick()">
      <span *ngIf="loading" class="spinner"></span>
      <ng-content *ngIf="!loading"></ng-content>
    </button>
  `,
  styles: [`
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-danger {
      background: #dc3545;
      color: white;
    }
    
    .btn-small {
      padding: 5px 10px;
      font-size: 12px;
    }
    
    .btn-large {
      padding: 15px 30px;
      font-size: 16px;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .spinner {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #333;
      border-radius: 50%;
      width: 12px;
      height: 12px;
      animation: spin 1s linear infinite;
      display: inline-block;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() btnClick = new EventEmitter<void>();

  get buttonClasses(): string[] {
    return [
      `btn-${this.variant}`,
      this.size !== 'medium' ? `btn-${this.size}` : ''
    ].filter(Boolean);
  }

  handleClick() {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit();
    }
  }
}

// Utilisation
@Component({
  template: `
    <app-button (btnClick)="save()">Enregistrer</app-button>
    
    <app-button 
      variant="danger" 
      (btnClick)="delete()">
      Supprimer
    </app-button>
    
    <app-button 
      variant="secondary"
      size="small"
      [loading]="isLoading"
      (btnClick)="submit()">
      {{ isLoading ? 'Envoi...' : 'Envoyer' }}
    </app-button>
  `
})
export class ParentComponent {
  isLoading = false;

  save() {
    console.log('Sauvegarde...');
  }

  delete() {
    console.log('Suppression...');
  }

  submit() {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }
}
```

**Exemple: Card réutilisable** :

```typescript
// card.component.ts
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [ngClass]="cardClasses">
      <div class="card-header" *ngIf="title || hasHeaderContent">
        <h3 *ngIf="title">{{ title }}</h3>
        <ng-content select="[header]"></ng-content>
      </div>
      
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <div class="card-footer" *ngIf="hasFooterContent">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card-header {
      background: #f8f9fa;
      padding: 15px;
      border-bottom: 1px solid #ddd;
    }
    
    .card-body {
      padding: 15px;
    }
    
    .card-footer {
      background: #f8f9fa;
      padding: 15px;
      border-top: 1px solid #ddd;
    }
    
    .card-elevated {
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() elevated = false;

  get cardClasses(): string[] {
    return this.elevated ? ['card-elevated'] : [];
  }

  get hasHeaderContent(): boolean {
    // Logique pour détecter le contenu du header
    return true;
  }

  get hasFooterContent(): boolean {
    return true;
  }
}

// Utilisation
@Component({
  template: `
    <app-card title="Mon Titre">
      <p>Contenu de la carte</p>
    </app-card>
    
    <app-card [elevated]="true">
      <div header>
        <h3>Titre personnalisé</h3>
        <button>Action</button>
      </div>
      
      <p>Contenu principal</p>
      
      <div footer>
        <button>Annuler</button>
        <button>Valider</button>
      </div>
    </app-card>
  `
})
export class ParentComponent {
}
```

---

## 3. Signals (Angular 19)

Les Signals sont une nouvelle approche de gestion de la réactivité introduite dans Angular 16+.

### 3.1 signal()

Crée une valeur réactive.

```typescript
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Compteur: {{ count() }}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
      <button (click)="reset()">Reset</button>
    </div>
  `
})
export class CounterComponent {
  // Créer un signal
  count = signal(0);

  // Lire la valeur avec ()
  getCount() {
    return this.count();
  }

  // Modifier avec set()
  increment() {
    this.count.set(this.count() + 1);
  }

  // Modifier avec update()
  decrement() {
    this.count.update(value => value - 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

**Exemple avec objets** :

```typescript

@Component({
  template: `
    <div>
      <h2>{{ user().name }}</h2>
      <p>{{ user().email }}</p>
      <button (click)="updateName()">Changer nom</button>
      <button (click)="updateUser()">Changer utilisateur</button>
    </div>
  `
})
export class UserComponent {
  user = signal({
    name: 'John',
    email: 'john@test.com',
    age: 25
  });

  // Modifier une propriété
  updateName() {
    this.user.update(u => ({
      ...u,
      name: 'Alice'
    }));
  }

  // Remplacer tout l'objet
  updateUser() {
    this.user.set({
      name: 'Bob',
      email: 'bob@test.com',
      age: 30
    });
  }
}
```

**Signal avec tableau** :

```typescript

@Component({
  template: `
    <ul>
      <li *ngFor="let item of items()">{{ item }}</li>
    </ul>
    <button (click)="addItem()">Ajouter</button>
    <button (click)="removeItem()">Supprimer dernier</button>
  `
})
export class ListComponent {
  items = signal<string[]>(['Item 1', 'Item 2']);

  addItem() {
    this.items.update(items => [...items, `Item ${items.length + 1}`]);
  }

  removeItem() {
    this.items.update(items => items.slice(0, -1));
  }

  clearAll() {
    this.items.set([]);
  }
}
```

### 3.2 computed()

Crée une valeur dérivée qui se recalcule automatiquement.

```typescript
import {Component, signal, computed} from '@angular/core';

@Component({
  template: `
    <div>
      <p>Prénom: <input [(ngModel)]="firstName" (input)="updateFirstName($event)"></p>
      <p>Nom: <input [(ngModel)]="lastName" (input)="updateLastName($event)"></p>
      
      <h3>Nom complet: {{ fullName() }}</h3>
      <p>Initiales: {{ initials() }}</p>
      <p>Longueur: {{ nameLength() }}</p>
    </div>
  `
})
export class NameComponent {
  firstName = signal('John');
  lastName = signal('Doe');

  // Computed signals - se recalculent automatiquement
  fullName = computed(() =>
    `${this.firstName()} ${this.lastName()}`
  );

  initials = computed(() =>
    `${this.firstName()[0]}${this.lastName()[0]}`
  );

  nameLength = computed(() =>
    this.fullName().length
  );

  updateFirstName(event: Event) {
    this.firstName.set((event.target as HTMLInputElement).value);
  }

  updateLastName(event: Event) {
    this.lastName.set((event.target as HTMLInputElement).value);
  }
}
```

**Exemple: Panier d'achat** :

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  template: `
    <div class="cart">
      <div *ngFor="let item of cart()">
        {{ item.name }} - {{ item.price }}€ x {{ item.quantity }}
      </div>
      
      <div class="summary">
        <p>Articles: {{ totalItems() }}</p>
        <p>Total: {{ totalPrice() }}€</p>
        <p>TVA (20%): {{ tax() }}€</p>
        <p>Total TTC: {{ totalWithTax() }}€</p>
      </div>
    </div>
  `
})
export class CartComponent {
  cart = signal<Product[]>([
    {id: 1, name: 'Laptop', price: 1000, quantity: 1},
    {id: 2, name: 'Mouse', price: 25, quantity: 2}
  ]);

  // Computed signals
  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cart().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  tax = computed(() =>
    this.totalPrice() * 0.2
  );

  totalWithTax = computed(() =>
    this.totalPrice() + this.tax()
  );

  addProduct(product: Product) {
    this.cart.update(items => [...items, product]);
  }

  removeProduct(id: number) {
    this.cart.update(items => items.filter(item => item.id !== id));
  }
}
```

### 3.3 effect()

Exécute du code à chaque fois qu'un signal change.

```typescript
import {Component, signal, effect} from '@angular/core';

@Component({
  template: `
    <input (input)="updateSearch($event)" placeholder="Rechercher...">
    <p>Résultats: {{ resultsCount() }}</p>
  `
})
export class SearchComponent {
  searchTerm = signal('');
  resultsCount = signal(0);

  constructor() {
    // Effect: s'exécute à chaque changement de searchTerm
    effect(() => {
      const term = this.searchTerm();
      console.log('Recherche pour:', term);

      // Simuler une recherche
      if (term.length > 2) {
        setTimeout(() => {
          this.resultsCount.set(Math.floor(Math.random() * 100));
        }, 500);
      } else {
        this.resultsCount.set(0);
      }
    });

    // Effect avec cleanup
    effect((onCleanup) => {
      const timer = setInterval(() => {
        console.log('Tick:', this.searchTerm());
      }, 1000);

      onCleanup(() => {
        clearInterval(timer);
      });
    });
  }

  updateSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}
```

**Exemple: Sauvegarde automatique** :

```typescript

@Component({
  template: `
    <textarea 
      [value]="content()" 
      (input)="updateContent($event)">
    </textarea>
    <p *ngIf="isSaving()">💾 Sauvegarde...</p>
    <p *ngIf="lastSaved()">✅ Sauvegardé à {{ lastSaved() | date:'HH:mm:ss' }}</p>
  `
})
export class AutoSaveComponent {
  content = signal('');
  isSaving = signal(false);
  lastSaved = signal<Date | null>(null);

  constructor() {
    // Auto-save effect
    effect(() => {
      const text = this.content();

      if (text.length > 0) {
        this.isSaving.set(true);

        // Simuler sauvegarde API
        setTimeout(() => {
          console.log('Sauvegarde:', text);
          this.isSaving.set(false);
          this.lastSaved.set(new Date());
        }, 1000);
      }
    });
  }

  updateContent(event: Event) {
    this.content.set((event.target as HTMLTextAreaElement).value);
  }
}
```

### 3.4 Signal Inputs/Outputs (Angular 17.1+)

```typescript
import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <button (click)="handleClick()">Sélectionner</button>
    </div>
  `
})
export class UserCardComponent {
  // Signal input (remplace @Input)
  user = input.required<{ name: string; email: string }>();
  isActive = input(false); // Avec valeur par défaut

  // Signal output (remplace @Output)
  userSelected = output<number>();

  handleClick() {
    this.userSelected.emit(123);
  }
}

// Utilisation
@Component({
  template: <app-user - card        [user] = "currentUser"       [isActive] = "true"(userSelected) = "onUserSelected($event)" > </app-user-card>  
})
export class ParentComponent {
  currentUser = {name: 'Alice', email: 'alice@test.com'};

  onUserSelected(id: number) {
    console.log('User selected:', id);
  }
}

---

##
4.
Dependency
Injection

Le
système
d
'injection de dépendances d'
Angular
permet
de
fournir
des
services
aux
composants.

###
4.1
inject()

function

```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // Service singleton disponible partout
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  
  constructor(private http: HttpClient) {}
  
  getUsers() {
    return this.http.get(this.apiUrl);
  }
}

// Utilisation avec inject() (Angular 14+)
import { Component, inject } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  template: `
...
`
})
export class UsersComponent {
  // Nouvelle syntaxe avec inject()
  private userService = inject(UserService);
  private http = inject(HttpClient);
  
  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      console.log(users);
    });
  }
}

// Ancienne syntaxe (toujours valide)
@Component({
  selector: 'app-users-old',
  template: `
...
`
})
export class UsersOldComponent {
  constructor(private userService: UserService) {}
  
  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      console.log(users);
    });
  }
}
```

### 4.2 providedIn

```typescript
// Singleton global
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
}

// Fourni dans un module spécifique
@Injectable({
  providedIn: UserModule
})
export class UserService {
}

// Fourni au niveau du composant
@Injectable() // Pas de providedIn
export class LocalService {
}

@Component({
  providers: [LocalService] // Nouvelle instance pour chaque composant
})
export class MyComponent {
  constructor(private localService: LocalService) {
  }
}
```

### 4.3 Providers Hierarchy

```typescript
// app.config.ts - Niveau application
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: API_URL,
      useValue: 'http://localhost:8080'
    },
    {
      provide: LoggerService,
      useClass: ConsoleLoggerService
    }
  ]
};

// Component niveau - Surcharge le provider
@Component({
  providers: [
    {
      provide: LoggerService,
      useClass: FileLoggerService // Utilise une autre implémentation
    }
  ]
})
export class AdminComponent {
}
```

**Injection Tokens** :

```typescript
import {InjectionToken} from '@angular/core';

// Créer un token
export const API_URL = new InjectionToken<string>('api.url');
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// Fournir une valeur
export const appConfig: ApplicationConfig = {
  providers: [
    {provide: API_URL, useValue: 'http://localhost:8080'},
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: 'http://localhost:8080',
        timeout: 30000
      }
    }
  ]
};

// Injecter
@Injectable()
export class ApiService {
  constructor(@Inject(API_URL) private apiUrl: string) {
    console.log('API URL:', this.apiUrl);
  }
}

// Avec inject()
export class DataService {
  private apiUrl = inject(API_URL);
  private config = inject(APP_CONFIG);
}
```

---

## 5. Routing

Le routeur Angular gère la navigation entre les vues.

### 5.1 Configuration de base

```typescript
// app.routes.ts
import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {ContactComponent} from './contact/contact.component';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: '**', component: NotFoundComponent} // 404
];

// app.config.ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};

// app.component.ts
import {Component} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Accueil</a>
      <a routerLink="/about">À propos</a>
      <a routerLink="/contact">Contact</a>
    </nav>
    
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
```

### 5.2 Routes avec paramètres

```typescript
// Routes
const routes: Routes = [
  {path: 'users/:id', component: UserDetailComponent},
  {path: 'products/:category/:id', component: ProductComponent},
  {path: 'search', component: SearchComponent} // Query params
];

// Lire les paramètres
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <h2>User ID: {{ userId }}</h2>
  `
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  userId: string | null = null;

  ngOnInit() {
    // Paramètre de route
    this.userId = this.route.snapshot.paramMap.get('id');

    // Observable (pour les changements)
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });

    // Query params (?page=1&size=10)
    this.route.queryParamMap.subscribe(params => {
      const page = params.get('page');
      const size = params.get('size');
    });
  }
}

// Navigation programmatique
import {Router} from '@angular/router';

@Component({
  template: `
    <button (click)="goToUser(123)">Voir utilisateur</button>
    <button (click)="goToSearch()">Rechercher</button>
  `
})
export class NavigationComponent {
  private router = inject(Router);

  goToUser(id: number) {
    this.router.navigate(['/users', id]);
  }

  goToSearch() {
    this.router.navigate(['/search'], {
      queryParams: {q: 'angular', page: 1}
    });
    // URL: /search?q=angular&page=1
  }
}
```

### 5.3 Routes imbriquées

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {path: 'overview', component: OverviewComponent},
      {path: 'stats', component: StatsComponent},
      {path: 'settings', component: SettingsComponent},
      {path: '', redirectTo: 'overview', pathMatch: 'full'}
    ]
  }
];

// dashboard.component.ts
@Component({
  template: `
    <div class="dashboard">
      <nav>
        <a routerLink="overview">Vue d'ensemble</a>
        <a routerLink="stats">Statistiques</a>
        <a routerLink="settings">Paramètres</a>
      </nav>
      
      <router-outlet></router-outlet>
    </div>
  `
})
export class DashboardComponent {
}
```

### 5.4 Lazy Loading

```typescript
// app.routes.ts
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-list.component').then(m => m.UserListComponent)
  }
];

// admin/admin.routes.ts
import {Routes} from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {path: '', component: AdminDashboardComponent},
  {path: 'users', component: AdminUsersComponent},
  {path: 'settings', component: AdminSettingsComponent}
];
```

### 5.5 Route Guards

```typescript
// auth.guard.ts
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

// Routes avec guard
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  }
];

// Guard avec paramètres
export const roleGuard = (requiredRole: string) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasRole(requiredRole)) {
      return true;
    }

    return router.parseUrl('/forbidden');
  };
};

// Utilisation
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard('ADMIN')]
  }
];
```

### 5.6 RouterLink avancé

```typescript

@Component({
  template: `
    <!-- Lien simple -->
    <a routerLink="/users">Utilisateurs</a>
    
    <!-- Avec paramètres -->
    <a [routerLink]="['/users', userId]">Détails</a>
    
    <!-- Avec query params -->
    <a [routerLink]="['/search']" 
       [queryParams]="{q: 'angular', page: 1}">
      Rechercher
    </a>
    
    <!-- Lien actif -->
    <a routerLink="/dashboard" 
       routerLinkActive="active"
       [routerLinkActiveOptions]="{exact: true}">
      Dashboard
    </a>
    
    <!-- Navigation relative -->
    <a [routerLink]="['../sibling']">Page soeur</a>
    <a [routerLink]="['./child']">Page enfant</a>
  `
})
export class NavComponent {
  userId = 123;
}
```

---

## 6. Forms

Angular offre deux approches pour gérer les formulaires.

### 6.1 Template-Driven Forms

Basés sur les directives dans le template.

```typescript
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
      <!-- Input texte -->
      <div>
        <label>Nom:</label>
        <input 
          type="text" 
          name="name"
          [(ngModel)]="user.name"
          #nameInput="ngModel"
          required
          minlength="3">
        
        <div *ngIf="nameInput.invalid && nameInput.touched">
          <p *ngIf="nameInput.errors?.['required']">Le nom est requis</p>
          <p *ngIf="nameInput.errors?.['minlength']">Minimum 3 caractères</p>
        </div>
      </div>
      
      <!-- Email -->
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          name="email"
          [(ngModel)]="user.email"
          #emailInput="ngModel"
          required
          email>
        
        <div *ngIf="emailInput.invalid && emailInput.touched">
          <p *ngIf="emailInput.errors?.['required']">L'email est requis</p>
          <p *ngIf="emailInput.errors?.['email']">Email invalide</p>
        </div>
      </div>
      
      <!-- Checkbox -->
      <div>
        <label>
          <input 
            type="checkbox" 
            name="agree"
            [(ngModel)]="user.agree">
          J'accepte les conditions
        </label>
      </div>
      
      <!-- Submit -->
      <button 
        type="submit"
        [disabled]="userForm.invalid">
        Envoyer
      </button>
      
      <!-- Debug -->
      <pre>{{ user | json }}</pre>
      <pre>Form valid: {{ userForm.valid }}</pre>
    </form>
  `
})
export class UserFormComponent {
  user = {
    name: '',
    email: '',
    agree: false
  };

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form submitted:', this.user);
    }
  }
}
```

### 6.2 Reactive Forms

Approche programmatique recommandée pour les formulaires complexes.

```typescript
import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <!-- Nom -->
      <div>
        <label>Nom:</label>
        <input formControlName="name">
        
        <div *ngIf="name.invalid && name.touched">
          <p *ngIf="name.errors?.['required']">Le nom est requis</p>
          <p *ngIf="name.errors?.['minlength']">
            Minimum {{ name.errors?.['minlength'].requiredLength }} caractères
          </p>
        </div>
      </div>
      
      <!-- Email -->
      <div>
        <label>Email:</label>
        <input formControlName="email">
        
        <div *ngIf="email.invalid && email.touched">
          <p *ngIf="email.errors?.['required']">L'email est requis</p>
          <p *ngIf="email.errors?.['email']">Email invalide</p>
        </div>
      </div>
      
      <!-- Mot de passe -->
      <div>
        <label>Mot de passe:</label>
        <input type="password" formControlName="password">
        
        <div *ngIf="password.invalid && password.touched">
          <p *ngIf="password.errors?.['required']">Le mot de passe est requis</p>
          <p *ngIf="password.errors?.['minlength']">Minimum 6 caractères</p>
        </div>
      </div>
      
      <!-- Confirmation -->
      <div>
        <label>Confirmer mot de passe:</label>
        <input type="password" formControlName="confirmPassword">
        
        <div *ngIf="registerForm.errors?.['passwordMismatch'] && 
                    confirmPassword.touched">
          <p>Les mots de passe ne correspondent pas</p>
        </div>
      </div>
      
      <!-- Submit -->
      <button 
        type="submit"
        [disabled]="registerForm.invalid">
        S'inscrire
      </button>
      
      <!-- Debug -->
      <pre>{{ registerForm.value | json }}</pre>
      <pre>Valid: {{ registerForm.valid }}</pre>
    </form>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  // Définir le formulaire
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minlength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minlength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  // Getters pour accéder aux contrôles
  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  // Validateur personnalisé
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirm = form.get('confirmPassword');

    if (password && confirm && password.value !== confirm.value) {
      return {passwordMismatch: true};
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
    }
  }
}
```

**Méthodes FormGroup** :

```typescript
// Définir une valeur
this.registerForm.patchValue({
  name: 'John',
  email: 'john@test.com'
});

// Remplacer toutes les valeurs
this.registerForm.setValue({
  name: 'Alice',
  email: 'alice@test.com',
  password: '123456',
  confirmPassword: '123456'
});

// Réinitialiser
this.registerForm.reset();

// Marquer comme touché
this.registerForm.markAllAsTouched();

// Écouter les changements
this.registerForm.valueChanges.subscribe(value => {
  console.log('Form changed:', value);
});

// Écouter un champ spécifique
this.name.valueChanges.subscribe(value => {
  console.log('Name changed:', value);
});

// Désactiver/Activer
this.name.disable();
this.name.enable();
```

### 6.3 FormArray

Pour gérer des listes dynamiques.

```typescript
import {FormArray} from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div formArrayName="skills">
        <div *ngFor="let skill of skills.controls; let i = index">
          <input [formControlName]="i" placeholder="Compétence {{ i + 1 }}">
          <button type="button" (click)="removeSkill(i)">Supprimer</button>
        </div>
      </div>
      
      <button type="button" (click)="addSkill()">Ajouter compétence</button>
      <button type="submit">Envoyer</button>
      
      <pre>{{ form.value | json }}</pre>
    </form>
  `
})
export class SkillsFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    skills: this.fb.array([
      this.fb.control(''),
      this.fb.control('')
    ])
  });

  get skills() {
    return this.form.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
```

---

## 7. HTTP & Services

### 7.1 HttpClient

```typescript
// user.service.ts
import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/users';

  // GET
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET avec paramètres
  getUsersPaginated(page: number, size: number): Observable<User[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<User[]>(this.apiUrl, {params});
  }

  // GET by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // POST
  createUser(user: Partial<User>): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<User>(this.apiUrl, user, {headers});
  }

  // PUT
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // DELETE
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// Utilisation dans un composant
@Component({
  template: `
    <div *ngFor="let user of users">
      {{ user.name }} - {{ user.email }}
    </div>
  `
})
export class UserListComponent {
  private userService = inject(UserService);
  users: User[] = [];

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
      complete: () => {
        console.log('Requête terminée');
      }
    });
  }
}
```

### 7.2 Observables RxJS

Les Observables sont des flux de données asynchrones.

**Opérateurs de base** :

```typescript
import {Component, inject} from '@angular/core';
import {map, filter, tap, catchError, switchMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {of, throwError} from 'rxjs';

@Component({
  template: `...`
})
export class RxjsExampleComponent {
  private userService = inject(UserService);

  ngOnInit() {
    // map: Transformer les données
    this.userService.getUsers()
      .pipe(
        map(users => users.map(u => u.name))
      )
      .subscribe(names => console.log(names));

    // filter: Filtrer les données
    this.userService.getUsers()
      .pipe(
        filter(users => users.length > 0)
      )
      .subscribe(users => console.log(users));

    // tap: Effet de bord (debug)
    this.userService.getUsers()
      .pipe(
        tap(users => console.log('Users loaded:', users))
      )
      .subscribe();

    // catchError: Gérer les erreurs
    this.userService.getUsers()
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return of([]); // Retourner un tableau vide
        })
      )
      .subscribe(users => console.log(users));

    // switchMap: Chaîner des requêtes
    this.userService.getUserById(1)
      .pipe(
        switchMap(user => this.userService.getUserPosts(user.id))
      )
      .subscribe(posts => console.log(posts));
  }

  // Recherche avec debounce
  onSearch(term: string) {
    of(term)
      .pipe(
        debounceTime(300), // Attendre 300ms
        distinctUntilChanged(), // Ignorer si identique
        switchMap(searchTerm =>
          this.userService.searchUsers(searchTerm)
        )
      )
      .subscribe(results => console.log(results));
  }
}
```

**Combinaison d'Observables** :

```typescript
import {forkJoin, combineLatest, merge} from 'rxjs';

export class DataComponent {
  private userService = inject(UserService);
  private productService = inject(ProductService);

  // forkJoin: Attendre que tous se terminent
  loadAllData() {
    forkJoin({
      users: this.userService.getUsers(),
      products: this.productService.getProducts(),
      orders: this.orderService.getOrders()
    }).subscribe(result => {
      console.log('Users:', result.users);
      console.log('Products:', result.products);
      console.log('Orders:', result.orders);
    });
  }

  // combineLatest: Combiner les dernières valeurs
  combineData() {
    combineLatest([
      this.userService.getUsers(),
      this.productService.getProducts()
    ]).subscribe(([users, products]) => {
      console.log('Users:', users);
      console.log('Products:', products);
    });
  }

  // merge: Fusionner plusieurs Observables
  mergeStreams() {
    merge(
      this.userService.getUsers(),
      this.productService.getProducts()
    ).subscribe(data => {
      console.log('Data:', data);
    });
  }
}
```

### 7.3 Gestion des erreurs

```typescript
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable()
export class ApiService {
  private http = inject(HttpClient);

  getData(): Observable<any> {
    return this.http.get('/api/data').pipe(
      retry(3), // Réessayer 3 fois
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

---

## 8. Lifecycle Hooks

Les lifecycle hooks permettent d'exécuter du code à des moments spécifiques du cycle de vie d'un composant.

### 8.1 ngOnInit

Appelé une fois après la création du composant et l'initialisation des @Input.

```typescript
import {Component, OnInit, inject} from '@angular/core';

@Component({
  template: `
    <h2>{{ title }}</h2>
    <ul>
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  title = 'Liste des utilisateurs';
  users: User[] = [];

  ngOnInit() {
    // Initialisation: charger les données
    console.log('Component initialized');

    this.loadUsers();
    this.setupConfiguration();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  private setupConfiguration() {
    // Configuration initiale
  }
}
```

### 8.2 ngOnDestroy

Appelé juste avant la destruction du composant. Utilisé pour le nettoyage.

```typescript
import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  template: `...`
})
export class DataComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();
  private intervalId?: number;

  ngOnInit() {
    // Subscription avec auto-unsubscribe
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        console.log(users);
      });

    // Timer à nettoyer
    this.intervalId = window.setInterval(() => {
      console.log('Tick');
    }, 1000);
  }

  ngOnDestroy() {
    // Nettoyage des subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // Nettoyage du timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    console.log('Component destroyed');
  }
}
```

### 8.3 ngOnChanges

Appelé quand une propriété @Input change.

```typescript
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-user-detail',
  template: `
    <div>
      <h3>{{ user?.name }}</h3>
      <p>{{ user?.email }}</p>
    </div>
  `
})
export class UserDetailComponent implements OnChanges {
  @Input() user?: User;
  @Input() isActive = false;

  ngOnChanges(changes: SimpleChanges) {
    // Détecte les changements sur les @Input
    console.log('Changes:', changes);

    if (changes['user']) {
      const currentValue = changes['user'].currentValue;
      const previousValue = changes['user'].previousValue;
      const firstChange = changes['user'].firstChange;
      console.log('User changed:', {
        current: currentValue,
        previous: previousValue,
        first: firstChange
      });

      if (!firstChange) {
        this.onUserUpdated(currentValue);
      }
    }

    if (changes['isActive']) {
      console.log('Active status changed:', changes['isActive'].currentValue);
    }
  }

  private onUserUpdated(user: User) {
// Logique quand l'utilisateur change
  }
}

###
8.4
ngAfterViewInit

Appelé
après
l
'initialisation de la vue du composant.
  ```typescript
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  template: `
< input
#searchInput
type = "text"
placeholder = "Rechercher..." >
  <div #content > Contenu < /div>
    `
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;
  
  ngAfterViewInit() {
    // Accès au DOM après le rendu
    console.log('View initialized');
    
    // Focus automatique
    this.searchInput.nativeElement.focus();
    
    // Modification du DOM
    this.content.nativeElement.style.backgroundColor = '#f0f0f0';
  }
}
```

### 8.5 Résumé des Lifecycle Hooks

```typescript
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  SimpleChanges
} from '@angular/core';

@Component({
  template: `...`
})
export class FullLifecycleComponent implements OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy {

  constructor() {
    console.log('1. constructor');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('2. ngOnChanges', changes);
  }

  ngOnInit() {
    console.log('3. ngOnInit');
  }

  ngDoCheck() {
    console.log('4. ngDoCheck');
  }

  ngAfterContentInit() {
    console.log('5. ngAfterContentInit');
  }

  ngAfterContentChecked() {
    console.log('6. ngAfterContentChecked');
  }

  ngAfterViewInit() {
    console.log('7. ngAfterViewInit');
  }

  ngAfterViewChecked() {
    console.log('8. ngAfterViewChecked');
  }

  ngOnDestroy() {
    console.log('9. ngOnDestroy');
  }
}
```

---

## Conclusion

Cette documentation couvre les concepts essentiels d'Angular 19 :

✅ **TypeScript** - Fondations du langage
✅ **Composants & Templates** - Building blocks de l'UI
✅ **Data Binding** - Synchronisation données/vue
✅ **Signals** - Nouvelle gestion de la réactivité
✅ **DI** - Injection de dépendances
✅ **Routing** - Navigation
✅ **Forms** - Gestion des formulaires
✅ **HTTP** - Communication API
✅ **Lifecycle** - Hooks de cycle de vie

