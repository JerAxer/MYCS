const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Import Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const { auth } = require("./middleware/auth");

const app = express();
app.use(express.json());

// Connexion DB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cfaodb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CFAO API Documentation",
      version: "1.0.0",
      description: "API pour la gestion des utilisateurs, entreprises, sites et évaluations CFAO",
      contact: {
        name: "Support API",
        email: "support@cfaodb.com"
      },
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html"
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Serveur de développement"
      },
  
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Entrez le token JWT avec le format 'Bearer {token}'"
        },
      }, 
      schemas: {
        User: {
          type: "object",
          required: ["username", "password"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique de l'utilisateur",
              example: "507f1f77bcf86cd799439011"
            },
            username: {
              type: "string",
              description: "Nom d'utilisateur unique",
              example: "john.doe"
            },
            password: {
              type: "string",
              format: "password",
              description: "Mot de passe (min 8 caractères)",
              minLength: 8,
              example: "monMotDePasse123"
            },
            first_name: {
              type: "string",
              description: "Prénom de l'utilisateur",
              example: "John"
            },
            last_name: {
              type: "string",
              description: "Nom de famille de l'utilisateur",
              example: "Doe"
            },
            role_id: {
              type: "string",
              description: "ID du rôle de l'utilisateur",
              example: "507f1f77bcf86cd799439012"
            },
            assessor_id: {
              type: "string",
              description: "ID de l'évaluateur associé",
              example: "507f1f77bcf86cd799439013"
            },
            is_active: {
              type: "boolean",
              description: "Statut actif/inactif de l'utilisateur",
              default: true
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Date de création de l'utilisateur"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification"
            }
          }
        },
        Auth: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              description: "Nom d'utilisateur",
              example: "john.doe"
            },
            password: {
              type: "string",
              format: "password",
              description: "Mot de passe",
              example: "monMotDePasse123"
            }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "Token JWT d'authentification"
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Message d'erreur détaillé"
            },
            code: {
              type: "string",
              description: "Code d'erreur pour le traitement programmatique",
              example: "VALIDATION_ERROR"
            },
            details: {
              type: "object",
              description: "Détails supplémentaires sur l'erreur"
            }
          }
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Page actuelle",
              example: 1
            },
            limit: {
              type: "integer",
              description: "Nombre d'éléments par page",
              example: 10
            },
            total: {
              type: "integer",
              description: "Nombre total d'éléments",
              example: 100
            },
            pages: {
              type: "integer",
              description: "Nombre total de pages",
              example: 10
            }
          }
        },
        Company: {
          type: "object",
          required: ["name"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique de l'entreprise",
              example: "507f1f77bcf86cd799439011"
            },
            name: {
              type: "string",
              description: "Nom de l'entreprise",
              example: "Entreprise ABC"
            },
            country_id: {
              type: "string",
              description: "ID du pays associé (référence vers Country)",
              example: "507f1f77bcf86cd799439012"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification"
            }
          }
        },
        Area: {
          type: "object",
          required: ["name"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique de la zone géographique",
              example: "507f1f77bcf86cd799439011"
            },
            name: {
              type: "string",
              description: "Nom de la zone géographique",
              example: "Europe",
              maxLength: 100
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification"
            }
          }
        },
        Site: {
          type: "object",
          required: ["code", "name", "country_id", "company_id"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique du site",
              example: "507f1f77bcf86cd799439011"
            },
            code: {
              type: "string",
              description: "Code unique du site",
              example: "SITE_PARIS",
              maxLength: 50
            },
            name: {
              type: "string",
              description: "Nom du site",
              example: "Site de Paris",
              maxLength: 100
            },
            internal_code: {
              type: "string",
              description: "Code interne de référence",
              example: "FR001",
              maxLength: 50
            },
            country_id: {
              type: "string",
              description: "ID du pays associé (référence vers Country)",
              example: "507f1f77bcf86cd799439012"
            },
            company_id: {
              type: "string",
              description: "ID de l'entreprise associée (référence vers Company)",
              example: "507f1f77bcf86cd799439013"
            },
            city: {
              type: "string",
              description: "Ville du site",
              example: "Paris",
              maxLength: 100
            },
            address: {
              type: "string",
              description: "Adresse complète du site",
              example: "123 Avenue des Champs-Élysées",
              maxLength: 255
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification"
            }
          }
        },
        Activity: {
          type: "object",
          required: ["code", "name"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique de l'activité",
              example: "507f1f77bcf86cd799439011"
            },
            code: {
              type: "string",
              description: "Code unique de l'activité",
              example: "MANUFACTURING",
              maxLength: 50
            },
            name: {
              type: "string",
              description: "Nom de l'activité",
              example: "Fabrication",
              maxLength: 100
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification"
            }
          }
        },
        Role: {
          type: "object",
          required: ["code", "name"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique du rôle",
              example: "507f1f77bcf86cd799439011"
            },
            code: {
              type: "string",
              description: "Code unique du rôle (en majuscules)",
              example: "ADMIN",
              maxLength: 50,
              pattern: "^[A-Z_]+$"
            },
            name: {
              type: "string",
              description: "Nom affichable du rôle",
              example: "Administrateur",
              maxLength: 100
            },
            description: {
              type: "string",
              description: "Description détaillée du rôle et des permissions",
              example: "Accès complet à toutes les fonctionnalités du système",
              maxLength: 500
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création du rôle"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification du rôle"
            }
          }
        },
        BusinessUnit: {
          type: "object",
          required: ["name", "activity_id"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique de l'unité métier",
              example: "507f1f77bcf86cd799439011"
            },
            name: {
              type: "string",
              description: "Nom de l'unité métier",
              example: "Division Fabrication",
              maxLength: 100
            },
            description: {
              type: "string",
              description: "Description détaillée de l'unité métier",
              example: "Division dédiée à la fabrication des produits",
              maxLength: 500
            },
            activity_id: {
              type: "string",
              description: "ID de l'activité associée (référence vers Activity)",
              example: "507f1f77bcf86cd799439012"
            },
            activity: {
              type: "object",
              description: "Activité peuplée (si populate utilisé)",
              properties: {
                _id: { type: "string" },
                code: { type: "string" },
                name: { type: "string" }
              }
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification"
            }
          }
        }

      },
      responses: {
        UnauthorizedError: {
          description: "Token d'accès manquant ou invalide",
          content: {
            "application/json": {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: "Token d'authentification requis",
                code: "UNAUTHORIZED"
              }
            }
          }
        },
        ValidationError: {
          description: "Erreur de validation des données",
          content: {
            "application/json": {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: "Données de requête invalides",
                code: "VALIDATION_ERROR",
                details: {
                  username: "Le nom d'utilisateur est requis"
                }
              }
            }
          }
        },
        NotFoundError: {
          description: "Ressource non trouvée",
          content: {
            "application/json": {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: "Utilisateur non trouvé",
                code: "NOT_FOUND"
              }
            }
          }
        }
      },
      parameters: {
        userId: {
          name: "id",
          in: "path",
          required: true,
          description: "ID MongoDB de l'utilisateur",
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "507f1f77bcf86cd799439011"
          }
        },
        pageParam: {
          name: "page",
          in: "query",
          description: "Numéro de page",
          schema: {
            type: "integer",
            minimum: 1,
            default: 1
          }
        },
        limitParam: {
          name: "limit",
          in: "query",
          description: "Nombre d'éléments par page",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        areaId: {
          name: "id",
          in: "path",
          required: true,
          description: "ID MongoDB de la zone géographique",
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "507f1f77bcf86cd799439011"
          }
        },
        siteId: {
          name: "id",
          in: "path",
          required: true,
          description: "ID MongoDB du site",
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "507f1f77bcf86cd799439011"
          }
        },
        activityId: {
          name: "id",
          in: "path",
          required: true,
          description: "ID MongoDB de l'activité",
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "507f1f77bcf86cd799439011"
          }
        },
        roleId: {
          name: "id",
          in: "path",
          required: true,
          description: "ID MongoDB du rôle",
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "507f1f77bcf86cd799439011"
          }
        },
        businessUnitId: {
          name: "id",
          in: "path",
          required: true,
          description: "ID MongoDB de l'unité métier",
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "507f1f77bcf86cd799439011"
          }
        }

      }
    },
    tags: [
      {
        name: "Authentication",
        description: "Endpoints d'authentification des utilisateurs"
      },
      {
        name: "Users",
        description: "Gestion des utilisateurs de l'application"
      },
      {
        name: "Companies",
        description: "Gestion des entreprises"
      },
      {
        name: "Sites",
        description: "Gestion des sites"
      },

      {
        name: "Areas",
        description: "Gestion des zones géographiques"
      },
      {
        name: "Activities",
        description: "Gestion des activités métiers et secteurs d'activité"
      },
      {
        name: "Roles",
        description: "Gestion des rôles utilisateurs et systèmes de permissions"
      },
      {
        name: "BusinessUnits",
        description: "Gestion des unités métiers (divisions, départements)"
      }
    ],
    externalDocs: {
      description: "Documentation technique complète",
      url: "https://docs.cfaodb.com"
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Route Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * === ROUTES PUBLIQUES (DOIT ÊTRE EN PREMIER) ===
 */
app.use("/user", require("./routes/User"));
app.use("/auth", require("./routes/auth"));

/**
 * === ROUTES PROTÉGÉES ===
 */
app.use("/area", auth, require("./routes/Area"));
app.use("/country", auth, require("./routes/Country"));
app.use("/company", auth, require("./routes/Company"));
app.use("/site", auth, require("./routes/Site"));
app.use("/role", auth, require("./routes/Role"));
app.use("/activity", auth, require("./routes/Activity"));
app.use("/businessunit", auth, require("./routes/BusinessUnit"));
app.use("/language", auth, require("./routes/Language"));
app.use("/assessor", auth, require("./routes/Assessor"));

/**
 * === ROUTES TECHNIQUES ===
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});