import React from "react";
import Collection_category from "../../components/collectrions/collection_category";
import {
  Feature_collections,
  HeadLine,
  Partners,
  Bids,
  NewseLatter,
  RoadMap,
} from "../../components/component";
import Meta from "../../components/Meta";
import Hero_5 from "../../components/hero/hero_5";
import Process from "../../components/blog/process";
import FilterCategoryItem from "../../components/categories/filterCategoryItem";
import Download from "../../components/blog/download";
import Story from "../../components/about/story";
import Team from "../../components/about/team";
import About_news from "../../components/blog/about_news";

const Home_5 = () => {
  return (
    <>
      <Meta title="PooPow | The World's Largest Digital Marketplace For NFT" />
      <Hero_5 />
      <Bids />
      <Process />
      <NewseLatter />
      <RoadMap />
      <Story compFor="about" />
      <Team />
      <Partners />
      <About_news />
    </>
  );
};

export default Home_5;
