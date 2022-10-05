import React from "react";
import HeadLine from "../headLine";
import { roadmapData } from "../../data/roadmapData";

const RoadMap = () => {
  return (
    <div id="roadmap">
      <section className="py-24">
        <div className="container">
          <HeadLine
            text="Roadmap"
            classes="font-display text-jacarta-700 mb-12 text-center text-3xl dark:text-white"
          />
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {roadmapData.map((item) => {
              const { id, title, actions } = item;
              return (
                <div className="text-center newseLatter-item" key={id}>
                  {/* <div
                    className={`mb-6 inline-flex rounded-full p-3`}
                    style={{ backgroundColor: icon.parentBg }}
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full`}
                      style={{ backgroundColor: icon.childBg }}
                    >
                      <svg className="icon icon-wallet h-5 w-5 fill-white">
                        <use xlinkHref={`/icons.svg#${icon.svg}`}></use>
                      </svg>
                    </div>
                  </div> */}
                  <h3 className="font-display text-left text-jacarta-700 mb-4 text-lg dark:text-white">
                    {title}
                  </h3>
                  {actions.map((action, index) => (
                    <div className="text-left" key={index}>
                      {index + 1}. {action}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoadMap;
