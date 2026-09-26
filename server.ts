import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
import firebaseConfig from "./firebase-applet-config.json";

let app: any;
try {
  app = getApps().length > 0 ? getApp() : initializeApp({
    projectId: firebaseConfig.projectId
  });
} catch (e) {
  console.warn('Firebase Admin app initialization warning:', e);
  app = getApps().length > 0 ? getApp() : initializeApp();
}

const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'ai-studio-faryalfc-f96a0aa8-dbbf-46a6-8a84-6432723334dc');
const auth = getAuth(app);

const PORT = 3000;

// Auth Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      code: 'auth/unauthorized'
    });
  }
};

const BOOTSTRAPPED_ADMIN = 'mdaniyalhayyat@gmail.com';

const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication required',
      code: 'auth/required'
    });
  }
  
  const isBootstrappedAdmin = req.user.email === BOOTSTRAPPED_ADMIN;
  if (isBootstrappedAdmin) return next();

  try {
    const adminDoc = await db.collection('admins').doc(req.user.uid).get();
    if (adminDoc.exists) {
      return next();
    }
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'Administrator privileges required',
      code: 'auth/forbidden'
    });
  } catch (err) {
    console.error('Error checking admin status:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to verify permissions'
    });
  }
};

// Validation Schemas
const schemas: Record<string, string[]> = {
  teams: ["id", "name", "shortName", "logo", "image", "color", "secondaryColor", "captainId", "coach", "status", "description", "played", "wins", "draws", "losses", "goalsFor", "goalsAgainst", "goalDifference", "points", "isClubTeam", "createdAt", "updatedAt"],
  players: ["id", "name", "number", "position", "image", "nationality", "birthDate", "height", "weight", "bio", "stats", "status", "isCaptain", "createdAt", "updatedAt"],
  matches: ["id", "homeTeamId", "awayTeamId", "homeTeamName", "awayTeamName", "date", "time", "venue", "competition", "status", "homeScore", "awayScore", "events", "notes", "matchReport", "createdAt", "updatedAt"],
  news: ["id", "title", "content", "summary", "image", "category", "date", "author", "status", "featured", "createdAt", "updatedAt"],
  competitions: ["id", "name", "season", "startDate", "endDate", "type", "active", "status", "description", "teamsCount", "createdAt", "updatedAt"],
  trophies: ["id", "competition", "season", "image", "achievement", "description", "title", "year", "createdAt", "updatedAt"],
  gallery: ["id", "url", "caption", "category", "date", "title", "description", "createdAt", "updatedAt"],
  media: ["id", "name", "url", "category", "size", "uploadedAt", "createdAt", "updatedAt"],
  activities: ["id", "adminEmail", "action", "details", "timestamp", "createdAt", "updatedAt"]
};

function validateBody(collection: string, body: any) {
  const allowedKeys = schemas[collection];
  if (!allowedKeys) return;

  const bodyKeys = Object.keys(body);
  const invalidKeys = bodyKeys.filter(key => !allowedKeys.includes(key));
  
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid fields: ${invalidKeys.join(', ')}`);
  }
}

function handleApiError(res: any, error: any, context: string) {
  console.error(`API Error [${context}]:`, error);
  const status = error.message && error.message.startsWith('Invalid fields') ? 400 : 500;
  res.status(status).json({
    error: status === 400 ? 'Bad Request' : 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    context
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Dynamic robots.txt
  app.get("/robots.txt", (req, res) => {
    const robotsContent = `# Faryal FC Official Robots.txt
User-agent: *
Allow: /
Allow: /team
Allow: /players
Allow: /matches
Allow: /standings
Allow: /news
Allow: /ground
Allow: /goals
Allow: /formation
Allow: /gallery
Allow: /about
Allow: /contact
Allow: /player/
Allow: /news/
Disallow: /admin
Disallow: /admin/*
Disallow: /login

Sitemap: https://faryal-fc.vercel.app/sitemap.xml
`;
    res.setHeader("Content-Type", "text/plain");
    res.send(robotsContent);
  });

  // Dynamic XML Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://faryal-fc.vercel.app";
      const now = new Date().toISOString().split("T")[0];

      // Static core public pages
      const corePages: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [
        { loc: `${baseUrl}/`, changefreq: "daily", priority: "1.0", lastmod: now },
        { loc: `${baseUrl}/team`, changefreq: "weekly", priority: "0.9", lastmod: now },
        { loc: `${baseUrl}/matches`, changefreq: "weekly", priority: "0.9", lastmod: now },
        { loc: `${baseUrl}/standings`, changefreq: "weekly", priority: "0.9", lastmod: now },
        { loc: `${baseUrl}/news`, changefreq: "daily", priority: "0.8", lastmod: now },
        { loc: `${baseUrl}/ground`, changefreq: "monthly", priority: "0.8", lastmod: now },
        { loc: `${baseUrl}/formation`, changefreq: "monthly", priority: "0.7", lastmod: now },
        { loc: `${baseUrl}/goals`, changefreq: "weekly", priority: "0.7", lastmod: now },
        { loc: `${baseUrl}/gallery`, changefreq: "weekly", priority: "0.7", lastmod: now },
        { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.7", lastmod: now },
        { loc: `${baseUrl}/contact`, changefreq: "monthly", priority: "0.7", lastmod: now },
      ];

      // Fetch dynamic players & news articles
      const dynamicPages: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [];

      try {
        if (db) {
          const [playersSnap, newsSnap] = await Promise.all([
            db.collection("players").get(),
            db.collection("news").get()
          ]);

          playersSnap.forEach((doc: any) => {
            const data = doc.data();
            if (data.status !== "inactive") {
              dynamicPages.push({
                loc: `${baseUrl}/player/${doc.id}`,
                changefreq: "weekly",
                priority: "0.8",
                lastmod: now,
              });
            }
          });

          newsSnap.forEach((doc: any) => {
            const data = doc.data();
            if (data.status !== "draft") {
              dynamicPages.push({
                loc: `${baseUrl}/news/${doc.id}`,
                changefreq: "monthly",
                priority: "0.7",
                lastmod: data.date ? new Date(data.date).toISOString().split("T")[0] : now,
              });
            }
          });
        }
      } catch (dbErr) {
        console.warn("Could not query dynamic sitemap items from Firestore:", dbErr);
      }

      const allPages = [...corePages, ...dynamicPages];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod || now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.send(xml);
    } catch (err: any) {
      console.error("Sitemap generation error:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Image Upload Endpoint (e.g. for player photos, logos, match banners)
  app.post("/api/upload", async (req: any, res: any) => {
    try {
      const { image, name } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Missing image data" });
      }

      // Check if data URL
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: "Invalid base64 image format. Expected data:image/...;base64,..." });
      }

      const rawExt = matches[1].toLowerCase();
      const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
      const buffer = Buffer.from(matches[2], 'base64');
      const safeName = (name || 'player').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const filename = `${safeName}_${Date.now()}.${ext}`;

      const uploadDir = path.join(process.cwd(), 'public', 'players');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);

      // Mirror to dist/players if dist directory exists
      try {
        const distDir = path.join(process.cwd(), 'dist', 'players');
        await fs.mkdir(distDir, { recursive: true });
        await fs.writeFile(path.join(distDir, filename), buffer);
      } catch {}

      res.json({ url: `/players/${filename}` });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message || "Failed to upload image" });
    }
  });

  app.use(authenticate);

  // Generic CRUD endpoints
  const collections = ["teams", "players", "matches", "news", "competitions", "trophies", "gallery"];

  // Specific Player API with dynamic stats
  app.get('/api/players', async (req: any, res: any) => {
    try {
      const playersSnapshot = await db.collection('players').get();
      let players = playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (players.length === 0) {
        try {
          const fallbackContent = await fs.readFile(path.join(process.cwd(), 'data', 'players.json'), 'utf-8');
          const seedPlayers = JSON.parse(fallbackContent);
          for (const p of seedPlayers) {
            const { id, ...data } = p;
            await db.collection('players').doc(id).set({
              ...data,
              createdAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp()
            });
          }
          players = seedPlayers;
        } catch (seedErr) {
          console.error("Error seeding players:", seedErr);
        }
      }
      
      const matchesSnapshot = await db.collection('matches').where('status', '==', 'completed').get();
      const matches = matchesSnapshot.docs.map(doc => doc.data());

      const playersWithStats = players.map((player: any) => {
        let goals = 0, assists = 0, yellowCards = 0, redCards = 0, appearances = 0;

        matches.forEach((match: any) => {
          const participated = match.events?.some((e: any) => e.playerId === player.id || e.assistId === player.id);
          if (participated) appearances++;

          if (match.events) {
            match.events.forEach((event: any) => {
              if (event.playerId === player.id) {
                if (event.type === 'goal') goals++;
                if (event.type === 'yellow_card') yellowCards++;
                if (event.type === 'red_card') redCards++;
              }
              if (event.assistId === player.id) {
                assists++;
              }
            });
          }
        });

        return {
          ...player,
          stats: {
            appearances,
            goals,
            assists,
            yellowCards,
            redCards,
            cleanSheets: player.stats?.cleanSheets || 0
          }
        };
      });

      res.json(playersWithStats);
    } catch (error) {
      try {
        const fallbackContent = await fs.readFile(path.join(process.cwd(), 'data', 'players.json'), 'utf-8');
        return res.json(JSON.parse(fallbackContent));
      } catch {
        handleApiError(res, error, 'GET_PLAYERS');
      }
    }
  });

  app.get('/api/players/:id', async (req: any, res: any) => {
    try {
      const playerDoc = await db.collection('players').doc(req.params.id).get();
      if (!playerDoc.exists) return res.status(404).json({ error: "Not found", message: "Player not found" });
      const player: any = { id: playerDoc.id, ...playerDoc.data() };

      const matchesSnapshot = await db.collection('matches').where('status', '==', 'completed').get();
      const matches = matchesSnapshot.docs.map(doc => doc.data());
      
      let goals = 0, assists = 0, yellowCards = 0, redCards = 0, appearances = 0;

      matches.forEach((match: any) => {
        const participated = match.events?.some((e: any) => e.playerId === player.id || e.assistId === player.id);
        if (participated) appearances++;

        if (match.events) {
          match.events.forEach((event: any) => {
            if (event.playerId === player.id) {
              if (event.type === 'goal') goals++;
              if (event.type === 'yellow_card') yellowCards++;
              if (event.type === 'red_card') redCards++;
            }
            if (event.assistId === player.id) {
              assists++;
            }
          });
        }
      });

      res.json({
        ...player,
        stats: {
          appearances,
          goals,
          assists,
          yellowCards,
          redCards,
          cleanSheets: player.stats?.cleanSheets || 0
        }
      });
    } catch (error) {
      try {
        const fallbackContent = await fs.readFile(path.join(process.cwd(), 'data', 'players.json'), 'utf-8');
        const players = JSON.parse(fallbackContent);
        const p = players.find((item: any) => item.id === req.params.id);
        if (p) return res.json(p);
      } catch {}
      handleApiError(res, error, 'GET_PLAYER_BY_ID');
    }
  });

  collections.forEach((collection) => {
    if (collection !== 'players') {
      app.get(`/api/${collection}`, async (req, res) => {
        try {
          const snapshot = await db.collection(collection).get();
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          res.json(data);
        } catch {
          res.json([]);
        }
      });

      app.get(`/api/${collection}/:id`, async (req, res) => {
        try {
          const doc = await db.collection(collection).doc(req.params.id).get();
          if (doc.exists) res.json({ id: doc.id, ...doc.data() });
          else res.status(404).json({ error: "Not found" });
        } catch {
          res.status(404).json({ error: "Not found" });
        }
      });
    }

    app.post(`/api/${collection}`, requireAdmin, async (req: any, res: any) => {
      try {
        validateBody(collection, req.body);
        const docRef = await db.collection(collection).add({
          ...req.body,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
        const doc = await docRef.get();
        res.status(201).json({ id: doc.id, ...doc.data() });
      } catch (error) {
        handleApiError(res, error, `CREATE_${collection.toUpperCase()}`);
      }
    });

    app.put(`/api/${collection}/:id`, requireAdmin, async (req: any, res: any) => {
      try {
        validateBody(collection, req.body);
        await db.collection(collection).doc(req.params.id).set({
          ...req.body,
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        const doc = await db.collection(collection).doc(req.params.id).get();
        res.json({ id: doc.id, ...doc.data() });
      } catch (error) {
        handleApiError(res, error, `UPDATE_${collection.toUpperCase()}`);
      }
    });

    app.delete(`/api/${collection}/:id`, requireAdmin, async (req: any, res: any) => {
      try {
        await db.collection(collection).doc(req.params.id).delete();
        res.status(204).send();
      } catch (error) {
        handleApiError(res, error, `DELETE_${collection.toUpperCase()}`);
      }
    });
  });

  // Settings endpoint
  app.get("/api/settings", async (req, res) => {
    const defaultSettings = {
      name: "Faryal FC",
      shortName: "FFC",
      founded: "2024",
      logo: "/logo.png",
      primaryColor: "#002d62",
      secondaryColor: "#ffffff",
      stadium: "Faryal Ground",
      ground: {
        name: "Faryal FC Ground",
        address: "20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan",
        latitude: 24.903822,
        longitude: 67.194202,
        mapsUrl: "https://share.google/WntzBRDQxKW4EUPPI"
      },
      history: "Faryal FC was established in 2024 with a vision to build a world-class footballing community. Starting from local roots in Karachi, the club has quickly grown into a competitive force, emphasizing youth development, tactical excellence, and a spirit that never says die.",
      vision: "To become the premier destination for footballing talent in the region.",
      mission: "To develop technically gifted players who play with passion and integrity.",
      socials: {
        instagram: "https://instagram.com/faryalfc",
        facebook: "https://facebook.com/faryalfc",
        whatsapp: "https://wa.me/923000000000"
      },
      contact: {
        email: "info@faryalfc.com",
        phone: "+92 300 000 0000",
        address: "20-A Main Rd, Model Colony, Karachi, Pakistan"
      }
    };

    try {
      const doc = await db.collection('settings').doc('club').get();
      if (doc.exists) {
        res.json(doc.data());
      } else {
        try {
          await db.collection('settings').doc('club').set(defaultSettings);
        } catch {}
        res.json(defaultSettings);
      }
    } catch {
      res.json(defaultSettings);
    }
  });

  app.put("/api/settings", requireAdmin, async (req: any, res: any) => {
    try {
      const allowedSettingsKeys = [
        "name", "shortName", "founded", "logo", "headerLogo", "footerLogo", "favicon", "tagline",
        "primaryColor", "secondaryColor", "stadium", "ground", "history", "vision", "mission",
        "socials", "contact", "footer", "theme", "branding", "hero", "homepageSections",
        "navigation", "seo", "maintenance", "formation"
      ];
      const invalidKeys = Object.keys(req.body).filter(key => !allowedSettingsKeys.includes(key));
      if (invalidKeys.length > 0) {
        return res.status(400).json({ error: "Bad Request", message: `Invalid fields: ${invalidKeys.join(', ')}` });
      }

      await db.collection('settings').doc('club').set(req.body, { merge: true });
      res.json(req.body);
    } catch (error) {
      handleApiError(res, error, 'UPDATE_SETTINGS');
    }
  });

  // Data Export / Backup endpoint
  app.get("/api/backup", requireAdmin, async (req: any, res: any) => {
    try {
      const backupData: Record<string, any> = {};
      const exportCollections = ['players', 'teams', 'matches', 'news', 'competitions', 'trophies', 'gallery', 'media'];
      
      for (const col of exportCollections) {
        try {
          const snap = await db.collection(col).get();
          backupData[col] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch {
          backupData[col] = [];
        }
      }

      try {
        const settingsDoc = await db.collection('settings').doc('club').get();
        if (settingsDoc.exists) {
          backupData['settings'] = settingsDoc.data();
        }
      } catch {}

      res.json({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        club: 'Faryal FC',
        data: backupData
      });
    } catch (error) {
      handleApiError(res, error, 'EXPORT_BACKUP');
    }
  });

  // Data Restore endpoint
  app.post("/api/backup/restore", requireAdmin, async (req: any, res: any) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ error: 'Missing restore data' });
      }

      const collections = ['players', 'teams', 'matches', 'news', 'competitions', 'trophies', 'gallery', 'media'];
      for (const col of collections) {
        if (Array.isArray(data[col])) {
          for (const item of data[col]) {
            const { id, ...itemData } = item;
            if (id) {
              await db.collection(col).doc(id).set(itemData, { merge: true });
            } else {
              await db.collection(col).add(itemData);
            }
          }
        }
      }

      if (data.settings) {
        await db.collection('settings').doc('club').set(data.settings, { merge: true });
      }

      res.json({ success: true, message: 'Data successfully restored' });
    } catch (error) {
      handleApiError(res, error, 'RESTORE_BACKUP');
    }
  });

  // Standings calculation endpoint
  app.get("/api/standings", async (req: any, res: any) => {
    try {
      let teams: any[] = [];
      let matches: any[] = [];

      try {
        const teamsSnapshot = await db.collection('teams').get();
        teams = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch {}

      try {
        const matchesSnapshot = await db.collection('matches').where('status', '==', 'completed').get();
        matches = matchesSnapshot.docs.map(doc => doc.data());
      } catch {}
      
      const stats = teams.map((team: any) => {
        const teamMatches = matches.filter((m: any) => 
          m.homeTeamId === team.id || m.awayTeamId === team.id
        );

        let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;

        teamMatches.forEach((m: any) => {
          const isHome = m.homeTeamId === team.id;
          const teamScore = isHome ? (m.homeScore || 0) : (m.awayScore || 0);
          const oppScore = isHome ? (m.awayScore || 0) : (m.homeScore || 0);

          gf += teamScore;
          ga += oppScore;

          if (teamScore > oppScore) wins++;
          else if (teamScore === oppScore) draws++;
          else losses++;
        });

        return {
          ...team,
          played: teamMatches.length,
          wins,
          draws,
          losses,
          goalsFor: gf,
          goalsAgainst: ga,
          goalDifference: gf - ga,
          points: (wins * 3) + draws
        };
      });

      const sorted = stats.sort((a: any, b: any) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });

      res.json(sorted);
    } catch {
      res.json([]);
    }
  });

  // Serve static assets from public folder
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.readFile(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
