import React, { useEffect, useState } from "react";
import TagTrend from "../TagTrend";
import { Link } from "react-router-dom";

function Trending({ tagTrend }) {
  const [trend, setTrend] = useState("");
  const [trendWidth, setTrendWidth] = useState(false);

  useEffect(() => {
    let tagElement1 = document.querySelectorAll(".tagClick")[1];
    let tagElement0 = document.querySelectorAll(".tagClick")[0];

    setTimeout(() => {
      tagElement0.click();
    }, 2000);

    if (window.innerWidth < 768) {
      setTrendWidth(true);
    } else {
      setTrendWidth(false);
    }

    let time = setTimeout(() => {
      setTrend(tagTrend[0]);
      tagElement1.click();
    }, 1000);

    return () => {
      clearTimeout(time);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrend = (trendName) => {
    setTrend(trendName);
  };

  return (
    <>
      <div className="min-w-full min-h-full flex items-start relative">
        <div className="sidbar_trend w-64 max-md:w-full h-[93vh] sticky left-0 top-[65px] bg-slate-900 text-white flex flex-col max-lg:w-[200px]">
          {tagTrend.map((tag, index) =>
            trendWidth ? (
              <button className="tagClick text-left text-white font-semibold cursor-pointer border-b border-slate-800">
                <Link
                  to={`/trending/${tag}`}
                  className="block w-full h-full px-2 py-4"
                  onClick={() => handleTrend(tag)}
                >
                  {tag}
                </Link>
              </button>
            ) : (
              <button
                className="tagClick text-left text-white font-semibold cursor-pointer px-2 py-4 border-b border-slate-800"
                key={index}
                onClick={() => handleTrend(tag)}
              >
                {tag}
              </button>
            )
          )}
        </div>
        <div className="flex-1 h-full text-white py-4 px-4 max-md:hidden">
          <TagTrend trend={trend} tagTrend={tagTrend} />
        </div>
      </div>
    </>
  );
}

export default Trending;
