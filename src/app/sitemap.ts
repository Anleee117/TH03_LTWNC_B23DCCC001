import { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects()
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${siteUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9
    }
  ];

  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((sub) => ({
    url: `${siteUrl}/subjects/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8
  }));

  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((d) => ({
    url: `${siteUrl}/deadlines/${d.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
