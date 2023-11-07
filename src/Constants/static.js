// //SAMPLE DATA
// const arr = [
// 	{
// 		title: "Starter",
// 		bgColor: "red",
// 		textColor: "blue",
// 		starts: {
// 			title: "Price starts at",
// 			values: [
// 				{
// 					value: "P5,000/mo",
// 					sub: "up to 50 accounts",
// 				},
// 				{
// 					value: "PROMO P3,000/mo",
// 					sub: "up to 100 accounts when you subscribe today",
// 				},
// 			],
// 		},
// 		addOn: {
// 			title: "Add on Price",
// 			values: {
// 				value: "P1,000",
// 				sub: "for every additional 25",
// 			},
// 		},
// 	},
// ];

import { addimage, addtext, addvideo } from "../assets/icons";
import { joinasiamain } from "../assets/img/news";

export const newsData = [
  {
    id: 1,
    coverURL: `${joinasiamain}`,
    headline: "Headline",
    subtitle: "this is the sub title",
    content: [
      {
        type: "text",
        value: "",
      },
      {
        type: "image",
        value: "",
      },
      {
        type: "video",
        value: "",
      },
    ],
  },
];
export const addNewsType = [
  {
    label: "Add Text",
    icon: `${addtext}`,
    value: "text",
  },
  {
    label: "Add Image",
    icon: `${addimage}`,
    value: "image",
  },
  {
    label: "Add Video",
    icon: `${addvideo}`,
    value: "video",
  },
];

export const fontSizeOpt = [
  {
    label: "Small",
    value: "text-sm",
  },
  {
    label: "Medium",
    value: "text-base",
  },
  {
    label: "Large",
    value: "text-lg",
  },
  {
    label: "Extra Large",
    value: "text-xl",
  },
  {
    label: "2x Extra Large",
    value: "text-2xl",
  },
];
export const fontWeightOpt = [
  {
    label: "Light",
    value: "font-light",
  },
  {
    label: "Normal",
    value: "font-normal",
  },
  {
    label: "Medium",
    value: "font-medium",
  },
  {
    label: "Semi Bold",
    value: "font-semibold",
  },
  {
    label: "Bold",
    value: "font-bold",
  },
  {
    label: "Extra Bold",
    value: "font-extrabold",
  },
];
export const textAlignOpt = [
  {
    label: "Left",
    value: "text-left",
  },
  {
    label: "Center",
    value: "text-center",
  },
  {
    label: "Right",
    value: "text-right",
  },
  {
    label: "Justify",
    value: "text-justify",
  },
];
export const textHeightOpt = [
  {
    label: "Tight",
    value: "leading-tight",
  },
  {
    label: "Normal",
    value: "leading-normal",
  },
  {
    label: "Relaxed",
    value: "leading-relaxed",
  },
  {
    label: "Loose",
    value: "leading-loose",
  },
];
