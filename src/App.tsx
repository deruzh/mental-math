import { useStore } from './state/store';
import { HomeScreen } from './components/HomeScreen';
import { LessonScreen } from './components/LessonScreen';
import { ChallengeScreen } from './components/ChallengeScreen';

export default function App() {
  const screen = useStore((s) => s.screen);
  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'lesson':
      return <LessonScreen />;
    case 'challenge':
      return <ChallengeScreen />;
  }
}
