import * as fs from 'fs'; 
import * as path from 'path';

async function generateSitemap(domain: string, profilesDirectory: string): Promise<void> {
  try {
    const sitemapPath = path.join(__dirname, '..', 'sitemap.xml'); 
    const stream = fs.createWriteStream(sitemapPath);

    const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const URLSET_OPEN = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const URLSET_CLOSE = '</urlset>';

    await stream.write(XML_DECLARATION);
    await stream.write(URLSET_OPEN);

    await writeUrl(stream, `${domain}`, 'weekly', '1.0');

    const profileFiles: string[] = await new Promise((resolve, reject) => {
      fs.readdir(profilesDirectory, (error, files) => {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });

    for (const profileFile of profileFiles) {
      if (profileFile.endsWith('.html')) {
        const profileUrl = `${domain}/user/profiles/${profileFile}`;
        await writeUrl(stream, profileUrl, 'daily', '0.8');
      }
    }

    await stream.write(URLSET_CLOSE);
    await stream.end();

    console.log('Sitemap generated successfully.');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

async function writeUrl(stream: fs.WriteStream, loc: string, changefreq: string, priority: string): Promise<void> {
  const url = `\t<url>\n\t\t<loc>${loc}</loc>\n\t\t<changefreq>${changefreq}</changefreq>\n\t\t<priority>${priority}</priority>\n\t</url>\n`;
  await stream.write(url);
}

generateSitemap('https://culero.com/', '/your/actual/user/profile/path');