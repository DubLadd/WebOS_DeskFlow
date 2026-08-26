import React from 'react';
import { useWindows } from './store';
import { Window } from './Window';
import { APPS } from './apps';

export const WindowManager: React.FC = () => {
  const { windows } = useWindows();

  return (
    <div className="absolute inset-0 pointer-events-none z-[1000]">
      {windows.map((win) => {
        const app = APPS.find((a) => a.id === win.appId);
        if (!app) return null;

        return (
          <div key={win.id} className="pointer-events-auto">
            <Window window={win}>
              <app.component window={win} />
            </Window>
          </div>
        );
      })}
    </div>
  );
};
