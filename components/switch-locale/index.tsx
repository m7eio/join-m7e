import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { ChevronDownIcon } from '@heroicons/react/solid';

export default function SwitchLocale() {
  const t = useTranslations('locale');

  const { locale, locales, route } = useRouter();
  return (
    <div className=" text-right">
      <Menu as="div" className="relative inline-block w-28 text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {t(locale)}
            <ChevronDownIcon
              className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-28 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white bg-purple-500' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  >
                    <Link href={route} locale="zh-CN">
                      简体中文
                    </Link>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500 text-white bg-purple-500' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm fonts-times-new-roman `}
                  >
                    <Link href={route} locale="en-US">
                      English
                    </Link>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
