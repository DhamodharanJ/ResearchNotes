import axios from "axios";
import React, { useState } from "react";
import { Text, Button, Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

function Youtube() {

  const { results } = useSelector((state) => state.resultData);
  const {splitMode} = useSelector(state=>state.noteData)

  return (
    <div className="h-full w-full  overflow-y-scroll">
      {results.videos &&
        results.videos.length > 0 &&
        results.videos.map((video, index) => {
          return (
            <div
              className="flex justify-center items-center md:m-2 xs:m-1 bg-white rounded-md box-border "
              key={index}
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt="thumbnail"
                className={`${splitMode ? 'h-24' : 'h-28'} p-2 rounded-sm`}
              />
              <div className="max-w-56">
                <Heading noOfLines={2} fontSize="small" >
                  {video.snippet.title}
                </Heading>
                {
                  !splitMode && 
                <Text noOfLines={1} fontSize="x-small">
                  {video.snippet.description}
                </Text>
                }
                <div className=" w-full flex justify-between p-1 text-gray-500 pr-4">
                  <div className="w-10/12">
                    <Text noOfLines={1} fontSize="x-small" className="w-26 font-semibold">
                      {video.snippet.channelTitle}
                    </Text>
                    <Text fontSize="xx-small" noOfLines={1} className="w-10/12">
                      {formatDistanceToNow(
                        new Date(video.snippet.publishedAt),
                        { addSuffix: true }
                      )}
                    </Text>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                  >
                    <img
                      width="30"
                      height="30"
                      src="https://img.icons8.com/color/48/youtube-play.png"
                      alt="youtube-play"
                    />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Youtube;
