'use client';

import MainNav from './components/nav';
import Task from './components/Tasks/Task';
import TempGroupWidget from './components/tempGroup';
import { navData, prefs } from './data';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  const urls = {
    ws: 'wss://v9e2el2mme.execute-api.us-east-2.amazonaws.com/production',
    lambda: 'https://28a5luoh60.execute-api.us-east-2.amazonaws.com/Prod',
  };

  const onArchiveTask = (id: string) => {
    console.log('Archive Task', id);
  },
  onPinTask = (id: string) => {
    console.log('Pin Task', id);
  };

  return (
    <>
      <MainNav data={navData} name="Hardwick Cider Company"></MainNav>


      <Task task={{ id: '1', title: 'Test Task', state: 'TASK_INBOX'}} onArchiveTask={onArchiveTask} onPinTask={onPinTask} />
      <Task task={{ id: '1', title: 'Test Task', state: 'TASK_INBOX'}} onArchiveTask={onArchiveTask} onPinTask={onPinTask} />
      <Task task={{ id: '1', title: 'Test Task', state: 'TASK_INBOX'}} onArchiveTask={onArchiveTask} onPinTask={onPinTask} />
      <Task task={{ id: '1', title: 'Test Task', state: 'TASK_INBOX'}} onArchiveTask={onArchiveTask} onPinTask={onPinTask} />
      <Task task={{ id: '1', title: 'Test Task', state: 'TASK_INBOX'}} onArchiveTask={onArchiveTask} onPinTask={onPinTask} />
      <Task task={{ id: '1', title: 'Test Task', state: 'TASK_INBOX'}} onArchiveTask={onArchiveTask} onPinTask={onPinTask} />

      <TempGroupWidget urls={urls} prefs={prefs}></TempGroupWidget>
      <Analytics />
    </>
  );
}
