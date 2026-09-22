import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating data directory", err);
  }
}

async function readData(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeData(filename: string, data: any) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  await ensureDataDir();
  const app = express();
  app.use(express.json());

  // Generic CRUD endpoints
  const collections = ["teams", "players", "matches", "news", "competitions", "trophies", "gallery"];

  // Specific Player API with dynamic stats (needs to be defined before generic GET)
  app.get('/api/players', async (req, res) => {
    const players = await readData('players.json');
    const matches = await readData('matches.json');

    const playersWithStats = players.map((player: any) => {
      let goals = 0, assists = 0, yellowCards = 0, redCards = 0, appearances = 0;

      matches.forEach((match: any) => {
        if (match.status !== 'completed') return;
        
        // Count appearances (if player in events or eventually in lineup)
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
  });

  app.get('/api/players/:id', async (req, res) => {
    const players = await readData('players.json');
    const player = players.find((p: any) => p.id === req.params.id);
    if (!player) return res.status(404).json({ error: "Not found" });

    const matches = await readData('matches.json');
    let goals = 0, assists = 0, yellowCards = 0, redCards = 0, appearances = 0;

    matches.forEach((match: any) => {
      if (match.status !== 'completed') return;
      
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
  });

  collections.forEach((collection) => {
    const filename = `${collection}.json`;

    // Skip GET if it's players (handled above)
    if (collection !== 'players') {
      app.get(`/api/${collection}`, async (req, res) => {
        const data = await readData(filename);
        res.json(data);
      });

      app.get(`/api/${collection}/:id`, async (req, res) => {
        const data = await readData(filename);
        const item = data.find((i: any) => i.id === req.params.id);
        if (item) res.json(item);
        else res.status(404).json({ error: "Not found" });
      });
    }

    app.post(`/api/${collection}`, async (req, res) => {
      const data = await readData(filename);
      const prefix = collection === 'matches' ? 'match_' : '';
      const newItem = { ...req.body, id: req.body.id || `${prefix}${Date.now()}` };
      data.push(newItem);
      await writeData(filename, data);
      res.status(201).json(newItem);
    });

    app.put(`/api/${collection}/:id`, async (req, res) => {
      const data = await readData(filename);
      const index = data.findIndex((item: any) => item.id === req.params.id);
      if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        await writeData(filename, data);
        res.json(data[index]);
      } else {
        res.status(404).json({ error: "Not found" });
      }
    });

    app.delete(`/api/${collection}/:id`, async (req, res) => {
      const data = await readData(filename);
      const newData = data.filter((item: any) => item.id !== req.params.id);
      await writeData(filename, newData);
      res.status(204).send();
    });
  });

  // Settings endpoint
  app.get("/api/settings", async (req, res) => {
    const filePath = path.join(DATA_DIR, "settings.json");
    try {
      const data = await fs.readFile(filePath, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      const defaultSettings = {
        name: 'Faryal FC',
        shortName: 'FFC',
        founded: '2024',
        logo: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e293b',
        stadium: 'Faryal Ground',
        history: '',
        vision: '',
        mission: '',
        socials: {},
        contact: { email: '', phone: '', address: '' }
      };
      await writeData("settings.json", defaultSettings);
      res.json(defaultSettings);
    }
  });

  app.put("/api/settings", async (req, res) => {
    await writeData("settings.json", req.body);
    res.json(req.body);
  });

  // Standings calculation endpoint
  app.get("/api/standings", async (req, res) => {
    const teams = await readData("teams.json");
    const matches = await readData("matches.json");
    
    const stats = teams.map((team: any) => {
      const teamMatches = matches.filter((m: any) => 
        m.status === 'completed' && (m.homeTeamId === team.id || m.awayTeamId === team.id)
      );

      let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;

      teamMatches.forEach((m: any) => {
        const isHome = m.homeTeamId === team.id;
        const teamScore = isHome ? m.homeScore : m.awayScore;
        const oppScore = isHome ? m.awayScore : m.homeScore;

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

    // Sort by points, then GD, then GF
    const sorted = stats.sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    res.json(sorted);
  });

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
