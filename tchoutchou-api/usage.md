# Guide d'utilisation de l'API Tchoutchou

Bienvenue dans la documentation de l'API Tchoutchou. Cette API permet d'accéder aux informations de transport en commun suisses, notamment la recherche de gares, les connexions entre gares, et la gestion des gares favorites.

---

## Table des matières

1. [Démarrage rapide](#démarrage-rapide)
2. [Base de l'API](#base-de-lapi)
3. [Endpoints](#endpoints)
   - [Points d'entrée](#points-dentrée)
   - [Transport](#transport)
     - [Rechercher des gares](#rechercher-des-gares)
     - [Rechercher des connexions](#rechercher-des-connexions)
     - [Tableau d'affichage d'une gare](#tableau-daffichage-dune-gare)
   - [Favoris](#favoris)
     - [Ajouter une gare favorite](#ajouter-une-gare-favorite)
     - [Lister les gares favorites](#lister-les-gares-favorites)
     - [Supprimer une gare favorite](#supprimer-une-gare-favorite)
4. [Réponses d'erreur](#réponses-derreur)

---

## Démarrage rapide

### 1. Cloner et installer les dépendances

```bash
git clone <repo-url>
cd tchoutchou-api
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec la variable `PORT` (optionnel, par défaut 3000) :

```env
PORT=3000
```

### 3. Démarrer le serveur

```bash
# Mode développement avec rechargement automatique
npm run start:dev

# Mode production
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000`.

---

## Base de l'API

- **URL de base** : `http://localhost:3000` (par défaut)
- **Format des réponses** : JSON
- **Encodage** : UTF-8

---

## Endpoints

### Points d'entrée

#### `GET /`

Retourne un message de bienvenue simple, utile pour vérifier que l'API fonctionne.

**Exemple avec `curl`** :
```bash
curl -X GET "http://localhost:3000/"
```

**Réponse** :
```json
"Hello World!"
```

---

### Transport

#### Rechercher des gares

**`GET /transport/locations`**

Recherche des gares, adresses ou points d'intérêt par nom ou coordonnées géographiques.

**Paramètres de requête** :

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `query` | `string` | Non | Nom de la gare, adresse ou point d'intérêt à rechercher |
| `x` | `number` | Non | Coordonnée X (longitude) pour une recherche géographique |
| `y` | `number` | Non | Coordonnée Y (latitude) pour une recherche géographique |
| `type` | `string` | Non | Type de résultat à retourner : `all`, `station`, `poi`, `address` |

> **Note** : Vous devez fournir au moins `query` ou le couple `x` et `y`.

**Exemple avec `curl`** :
```bash
curl -X GET "http://localhost:3000/transport/locations?query=Bern"
```

**Réponse** :
```json
{
  "stations": [
    {
      "id": "8507000",
      "name": "Bern",
      "type": "station",
      "score": 109,
      "coordinate": {
        "type": "WGS84",
        "x": 7.439018,
        "y": 46.948825
      },
      "distance": null
    }
  ]
}
```

---

#### Rechercher des connexions

**`GET /transport/connections`**

Recherche des trajets en train entre deux gares, avec possibilité de spécifier des arrêts intermédiaires.

**Paramètres de requête** :

| Paramètre | Type | Obligatoire | Description | Contraintes |
|-----------|------|-------------|-------------|-------------|
| `from` | `string` | **Oui** | Gare de départ | - |
| `to` | `string` | **Oui** | Gare d'arrivée | - |
| `via` | `string[]` | Non | Arrêts intermédiaires (maximum 5) | Max 5 éléments |
| `date` | `string` | Non | Date du trajet | Format `YYYY-MM-DD` |
| `time` | `string` | Non | Heure du trajet | Format `HH:MM` (24h) |
| `isArrivalTime` | `boolean` | Non | Indique si l'heure est une heure d'arrivée | `true` ou `false` |
| `limit` | `number` | Non | Nombre maximum de résultats | Entre 1 et 16 |
| `page` | `number` | Non | Numéro de page pour la pagination | Entre 0 et 3 |

**Exemple avec `curl`** :
```bash
curl -X GET "http://localhost:3000/transport/connections?from=Bern&to=Zürich&date=2024-06-15&time=14:00&limit=3"
```

**Réponse** :
```json
{
  "connections": [
    {
      "from": {
        "station": { "id": "8507000", "name": "Bern", ... },
        "arrival": null,
        "arrivalTimestamp": null,
        "departure": "2024-06-15T14:02:00+0200",
        "departureTimestamp": 1718455320,
        "delay": null,
        "platform": "5",
        "prognosis": null
      },
      "to": {
        "station": { "id": "8503000", "name": "Zürich HB", ... },
        "arrival": "2024-06-15T15:00:00+0200",
        "arrivalTimestamp": 1718458800,
        "departure": null,
        "departureTimestamp": null,
        "delay": null,
        "platform": "32",
        "prognosis": null
      },
      "duration": "00d00:58:00",
      "service": null,
      "products": ["IC 8"],
      "capacity1st": null,
      "capacity2nd": null,
      "sections": [...]
    }
  ]
}
```

---

#### Tableau d'affichage d'une gare

**`GET /transport/stationboard`**

Affiche les prochains départs ou arrivées d'une gare spécifique.

**Paramètres de requête** :

| Paramètre | Type | Obligatoire | Description | Contraintes |
|-----------|------|-------------|-------------|-------------|
| `station` | `string` | Non (si `id` fourni) | Nom de la gare | - |
| `id` | `string` | Non (si `station` fourni) | Identifiant de la gare | - |
| `limit` | `number` | Non | Nombre de résultats à retourner | - |
| `datetime` | `string` | Non | Date et heure de début | Format `YYYY-MM-DD hh:mm` |
| `type` | `string` | Non | Type d'affichage | `departure` ou `arrival` |

> **Note** : Vous devez fournir au moins `station` ou `id`.

**Exemple avec `curl`** :
```bash
curl -X GET "http://localhost:3000/transport/stationboard?station=Genève&limit=5&type=departure"
```

**Réponse** :
```json
{
  "station": {
    "id": "8501008",
    "name": "Genève",
    "type": "station",
    "score": null,
    "coordinate": { "type": "WGS84", "x": 6.143828, "y": 46.210156 },
    "distance": null
  },
  "stationboard": [
    {
      "stop": {
        "station": { "id": "8501008", "name": "Genève", ... },
        "arrival": "15:05",
        "arrivalTimestamp": 1718459100,
        "departure": "15:06",
        "departureTimestamp": 1718459160,
        "delay": null,
        "platform": null,
        "prognosis": null
      },
      "name": "IC 737",
      "category": "IC",
      "number": "737",
      "operator": "SBB",
      "to": "Lausanne"
    }
  ]
}
```

---

### Favoris

#### Ajouter une gare favorite

**`POST /favorites/stations`**

Ajoute une gare à la liste des favoris d'un utilisateur.

**Corps de la requête** (JSON) :

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `stationId` | `string` | **Oui** | Identifiant unique de la gare |
| `stationName` | `string` | Non | Nom affiché de la gare |
| `userId` | `number` | Non | Identifiant de l'utilisateur (minimum 1) |

**Exemple** :
```bash
curl -X POST "http://localhost:3000/favorites/stations" \
  -H "Content-Type: application/json" \
  -d '{
    "stationId": "8507000",
    "stationName": "Bern",
    "userId": 1
  }'
```

**Réponse** (201 Created) :
```json
{
  "id": "1",
  "stationId": "8507000",
  "stationName": "Bern"
}
```

---

#### Lister les gares favorites

**`GET /favorites/stations`**

Récupère la liste des gares favorites d'un utilisateur.

**Paramètres de requête** :

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `userId` | `string` | Non | Filtrer par identifiant d'utilisateur |

**Exemple avec `curl`** :
```bash
curl -X GET "http://localhost:3000/favorites/stations?userId=1"
```

**Réponse** :
```json
[
  {
    "id": "1",
    "stationId": "8507000",
    "stationName": "Bern"
  },
  {
    "id": "2",
    "stationId": "8503000",
    "stationName": "Zürich HB"
  }
]
```

---

#### Supprimer une gare favorite

**`DELETE /favorites/stations/:id`**

Supprime une gare de la liste des favoris.

**Paramètres d'URL** :

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `id` | `string` | **Oui** | Identifiant du favori à supprimer |

**Paramètres de requête** :

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `userId` | `string` | Non | Identifiant de l'utilisateur |

**Exemple** :
```bash
curl -X DELETE "http://localhost:3000/favorites/stations/1?userId=1"
```

**Réponse** : `204 No Content` (pas de corps de réponse)

---

## Réponses d'erreur

L'API utilise les codes de statut HTTP standard. En cas d'erreur, vous pouvez recevoir :

| Code | Description | Cas typiques |
|------|-------------|------------|
| `400` | Bad Request | Paramètres manquants ou invalides |
| `404` | Not Found | Route inexistante |
| `500` | Internal Server Error | Erreur interne du serveur |
| `502` | Bad Gateway | Réponse invalide de l'API de transport externe |

**Exemple de réponse d'erreur (400)** :
```json
{
  "statusCode": 400,
  "message": ["Date format must be YYYY-MM-DD"],
  "error": "Bad Request"
}
```

**Exemple de réponse d'erreur (502)** :
```json
{
  "statusCode": 502,
  "message": "Invalid response from transport API",
  "errors": [
    { "path": "connections.0.duration", "message": "Invalid type" }
  ]
}
```

---

> ℹ️ Cette API s'appuie sur l'API publique [transport.opendata.ch](https://transport.opendata.ch/) pour les données de transport suisses.

> _Note : un outil d'IA a été utilisé pour faire ce fichier_