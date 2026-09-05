export type VirtualFile = { type: 'file' | 'directory'; content?: string };

export const INITIAL_FILES: Record<string, VirtualFile> = {
  '/': { type: 'directory' },
  '/home': { type: 'directory' },
  '/home/user': { type: 'directory' },
  '/home/user/README.md': { type: 'file', content: '# DeskFlow workspace\n' },
  '/home/user/projects': { type: 'directory' },
  '/tmp': { type: 'directory' },
};

export function normalizePath(path: string, cwd: string) {
  const raw = path.startsWith('/') ? path : `${cwd}/${path}`;
  const parts = raw.split('/').filter(Boolean);
  const result: string[] = [];
  for (const part of parts) {
    if (part === '..') result.pop();
    else if (part !== '.') result.push(part);
  }
  return `/${result.join('/')}` || '/';
}

export function parentPath(path: string) {
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return `/${parts.join('/')}` || '/';
}
