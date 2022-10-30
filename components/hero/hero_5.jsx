import Link from "next/link";
import React from "react";
import { hero_5_data } from "../../data/coverflow_data";

const Hero_5 = () => {
  return (
    <>
      {/* <!-- Hero --> */}
      <section className="relative py-20 md:pt-32">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img src="/images/gradient.jpg" alt="gradient" className="h-full" />
        </picture>
        <picture className="pointer-events-none absolute inset-0 -z-10 hidden dark:block opacity-40">
          <img
            src="/images/gradient_dark.jpg"
            alt="gradient dark"
            className="h-full"
          />
        </picture>

        <div className="h-full px-6 xl:px-20">
          <div className="grid h-full items-center gap-4 lg:grid-cols-12">
            <div className="col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-5 xl:pl-[20%] xl:pr-[10%]">
              <div className="mb-10 w-full sm:flex sm:space-x-4">
                <div className="mb-4 flex-1 rounded-2lg bg-white p-4 text-center dark:bg-white/[.15]">
                  <span className="block font-display text-3xl text-[#f6b657]">
                    999
                  </span>
                  <span className="block font-display text-sm text-jacarta-500 dark:text-white">
                    Common Poo
                  </span>
                </div>
                <div className="mb-4 flex-1 rounded-2lg bg-white p-4 text-center dark:bg-white/[.15]">
                  <span className="block font-display text-3xl text-[#737EF2]">
                    333
                  </span>
                  <span className="block font-display text-sm text-jacarta-500 dark:text-white">
                    Rare Poo
                  </span>
                </div>
                <div className="mb-4 flex-1 rounded-2lg bg-white p-4 text-center dark:bg-white/[.15]">
                  <span className="block font-display text-3xl text-[#F35BC7]">
                    111
                  </span>
                  <span className="block font-display text-sm text-jacarta-500 dark:text-white">
                    Legendary Poo
                  </span>
                </div>
              </div>
              <h1 className="mb-6 text-center font-display text-5xl text-jacarta-700 dark:text-white md:text-left lg:text-5xl xl:text-6xl">
                PooAptos – Trade, Farm And Stake Your “Poo” NFT Assests
              </h1>
              <p className="mb-8 text-center text-lg dark:text-jacarta-200 md:text-left">
                PooAptos Is One Of The Biggest Platform On Aptos Network
                Including NFT Minting Event, NFT Marketplace, Farming And
                Staking,..
              </p>
              <div className="flex space-x-4">
                <Link href="https://explorer.aptoslabs.com/">
                  <a className="w-36 rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark">
                    Explorer
                  </a>
                </Link>
                <Link href="/">
                  <a className="w-36 rounded-full bg-white py-3 px-8 text-center font-semibold text-accent shadow-white-volume transition-all hover:bg-accent-dark hover:text-white hover:shadow-accent-volume">
                    Mint NFT
                  </a>
                </Link>
              </div>
            </div>

            {/* <!-- Hero images --> */}
            <div className="relative col-span-6 xl:col-span-6 xl:col-start-7">
              <img
                src="/images/hero/badge.png"
                className="absolute top-0 z-10 -ml-16 animate-spin-slow md:top-[12%]"
                alt=""
              />
              <div className="md:flex md:space-x-6 xl:space-x-12">
                {hero_5_data.map((item, index) => {
                  const { id, img, title, authorImage, authorName, subItem } =
                    item;
                  const itemLink = img
                    .split("/")
                    .slice(-1)
                    .toString()
                    .replace("_2lg.jpg", "")
                    .replace(".gif", "");
                  return (
                    <div
                      className={
                        index === 0
                          ? "mb-6 md:flex md:w-1/2 md:items-center"
                          : "space-y-6 md:w-1/2 xl:space-y-12"
                      }
                      key={id}
                    >
                      <article>
                        <div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700">
                          <figure className="relative">
                            <a>
                              <img
                                src={img}
                                alt="item 1"
                                className="w-full object-cover"
                                height="437"
                                width="406"
                              />
                            </a>
                          </figure>
                          <div className="p-6">
                            <div className="flex">
                              <a className="shrink-0">
                                <img
                                  src={authorImage}
                                  alt="avatar"
                                  className="mr-4 h-10 w-10 rounded-full"
                                />
                              </a>
                              <div>
                                <a className="block">
                                  <span className="font-display text-lg leading-none text-jacarta-700 hover:text-accent dark:text-white">
                                    {title}
                                  </span>
                                </a>
                                <a className="text-2xs text-accent">
                                  {authorName}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>

                      {subItem &&
                        subItem.map(
                          ({ id, img, title, authorImage, authorName }) => {
                            const itemLink = img
                              .split("/")
                              .slice(-1)
                              .toString()
                              .replace(".jpg", "")
                              .replace(".gif", "")
                              .replace("_lg", "");
                            return (
                              <div className="md:w-3/4" key={id}>
                                <article>
                                  <div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700">
                                    <figure className="relative">
                                      <a>
                                        <img
                                          src={img}
                                          alt="item 1"
                                          className="w-full object-cover"
                                          height="437"
                                          width="406"
                                        />
                                      </a>
                                    </figure>
                                    <div className="p-6">
                                      <div className="flex">
                                        <a className="shrink-0">
                                          <img
                                            src={authorImage}
                                            alt="avatar"
                                            className="mr-4 h-10 w-10 rounded-full"
                                          />
                                        </a>
                                        <div>
                                          <a className="block">
                                            <span className="font-display text-lg leading-none text-jacarta-700 hover:text-accent dark:text-white">
                                              {title}
                                            </span>
                                          </a>
                                          <a className="text-2xs text-accent">
                                            {authorName}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            );
                          }
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- end hero --> */}
    </>
  );
};

export default Hero_5;
