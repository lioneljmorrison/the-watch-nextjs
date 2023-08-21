import MainNav from './components/nav';
import TempWidget from './components/temp';
import { navData, prefs } from './data';
import { DeviceStatus } from './interfaces';
import { tempMock } from './temp-mock-data';

export default function Home() {
  return (
    <>
      <MainNav data={navData} name="Hardwick Cider Company"></MainNav>
      {/* <TempWidget data={tempMock[0]}></TempWidget> */}
      <div className='pt-4 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
        {tempMock.map((temp: DeviceStatus, idx: number) => {
          return <TempWidget key={idx} data={temp} prefs={prefs}></TempWidget>;
        })}
      </div>
    </>

    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //     Code here
    // </main>
  );
}
