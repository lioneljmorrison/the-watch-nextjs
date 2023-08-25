import WebSocketClient from './WebSocketClient';
import MainNav from './components/nav';
import TempGroupWidget from './components/tempGroup';
import { navData, prefs } from './data';

export default function Home() {
  const urls = {
    ws: 'wss://v9e2el2mme.execute-api.us-east-2.amazonaws.com/production',
    lambda: 'https://28a5luoh60.execute-api.us-east-2.amazonaws.com/Prod',
  };

  return (
    <>
      {/* <WebSocketClient url={urls.ws}></WebSocketClient> */}
      <MainNav data={navData} name="Hardwick Cider Company"></MainNav>
      <TempGroupWidget urls={urls} prefs={prefs}></TempGroupWidget>
    </>
  );
}
