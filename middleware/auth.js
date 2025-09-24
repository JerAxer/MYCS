const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Vérifier la présence du header Authorization
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "Access denied. No valid token provided.",
        code: "NO_TOKEN"
      });
    }

    // Extraire le token
    const token = authHeader.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        error: "Access denied. Token missing.",
        code: "TOKEN_MISSING"
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    
    // Vérifier si l'utilisateur existe toujours dans la base
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ 
        error: "User no longer exists.",
        code: "USER_NOT_FOUND"
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.is_active) {
      return res.status(401).json({ 
        error: "User account is deactivated.",
        code: "USER_INACTIVE"
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role_id: user.role_id
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Invalid token.",
        code: "INVALID_TOKEN"
      });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token has expired.",
        code: "TOKEN_EXPIRED"
      });
    } else {
      console.error("Auth middleware error:", err);
      return res.status(500).json({ 
        error: "Authentication error.",
        code: "AUTH_ERROR"
      });
    }
  }
};

// Middleware optionnel pour vérifier les rôles (si vous avez un système de rôles)
const requireRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required." });
      }

      // implémenter les roles ici
      // Pour l'instant, on vérifie juste si l'utilisateur est authentifié
      // Vous pouvez étendre cette fonctionnalité plus tard
      
      next();
    } catch (err) {
      res.status(403).json({ error: "Access forbidden." });
    }
  };
};

module.exports = { auth, requireRole };