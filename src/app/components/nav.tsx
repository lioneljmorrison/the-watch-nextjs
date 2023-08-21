'use client';
import Link from 'next/link';
import { useState } from 'react';
import { NavLinks } from '../interfaces';

export default function MainNav({ data, name }: { data: NavLinks; name: string }) {
  const [display, setDisplay] = useState(false);
  const [displayCss, setDisplayCss] = useState('hidden');
  const navItemsArray = Object.entries(data)
    .map((item) => (item[1]?.disabled !== true ? item : undefined))
    .filter((item) => item !== undefined);

  function mobileMenuIconClick() {
    setDisplay((prevDisplay) => !prevDisplay);
    setDisplayCss(display ? 'hidden' : 'md:hidden');
  }

  function scrollTo(id: string) {
    var element = document.getElementById(id);
    mobileMenuIconClick();
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <nav className="z-20 sticky top-0 bg-gray-800 text-slate-50">
      <div className="max-w-7xl mx-auto py-4 px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>The Watch - {name}</div>
          <div className="hidden md:flex items-center space-x-5 text-sm">
            {navItemsArray.map((item, idx) => {
              if (item) {
                const [title, meta] = [...item];

                return (
                  <Link
                    key={`nav-${idx}`}
                    href={meta.href}
                    onClick={() => scrollTo(meta.href.substring(1))}
                    target={meta?.target}
                    className="last:nav-button py-1 px-2 hover:bg-gray-700 transition transition-duration-300 rounded"
                  >
                    {title}
                  </Link>
                );
              }
            })}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={mobileMenuIconClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${displayCss} min-h-screen transition transition-duration-300`}>
        {navItemsArray.map((item, idx) => {
          if (item) {
            const [title, meta] = [...item];
            return (
              <Link
                key={`nav-${idx}`}
                onClick={() => scrollTo(meta.href.substring(1))}
                href={meta.href}
                target={meta?.target}
                className="block py-3 px-6 text-lg hover:bg-gray-700 text-right"
              >
                {title}
              </Link>
            );
          }
        })}
      </div>
    </nav>
  );
}
