// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel",
//     ],
//   };
// };



module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: [
      // expo-router should run first
      "expo-router/babel",
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./", // change to "./" if you don't use src folder
          }
        },
      ],
    ],
  };
};