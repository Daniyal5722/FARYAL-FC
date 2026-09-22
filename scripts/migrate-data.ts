import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';

const config = JSON.parse(await fs.readFile(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
const DATA_DIR = path.join(process.cwd(), 'data');

async function migrate() {
  const collections = ['teams', 'players', 'matches', 'news', 'competitions', 'trophies', 'gallery'];

  for (const collectionName of collections) {
    const filePath = path.join(DATA_DIR, `${collectionName}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      console.log(`Migrating ${data.length} items to ${collectionName}...`);

      for (const item of data) {
        const { id, ...rest } = item;
        const docId = id || doc(db, collectionName).id;
        await setDoc(doc(db, collectionName, docId), {
          ...rest,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log(`Successfully migrated ${collectionName}`);
    } catch (err) {
      console.error(`Error migrating ${collectionName}:`, (err as Error).message);
    }
  }

  // Migrate settings
  try {
    const settingsPath = path.join(DATA_DIR, 'settings.json');
    const settingsContent = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsContent);
    console.log('Migrating settings/club...');
    await setDoc(doc(db, 'settings', 'club'), {
      ...settings,
      updatedAt: new Date().toISOString()
    });
    console.log('Successfully migrated settings/club');
  } catch (err) {
    console.error('Error migrating settings:', (err as Error).message);
  }

  console.log('All migrations completed successfully!');
  process.exit(0);
}

migrate().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});
