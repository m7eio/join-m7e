import React from 'react';

export default function Footer() {
  return (
    <footer className="w-gray bg-black flex text-white flex items-center	">
      <div>
        <div className="flex items-center">
          <section className="flex flex-col	h-full fonts-times-new-roman ">
            <span className="text-gray-200 text-sm mt-4">
              Copyright © {`${new Date().getFullYear()} `} NFT4Metaverse Inc. All rights reserved.
            </span>
          </section>
        </div>
      </div>
    </footer>
  );
}
