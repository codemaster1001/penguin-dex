module.exports = {
  "**/*.(ts|tsx)": () => "npm run lint:fix",

  "**/*.(ts|tsx|js)": (filenames) => [`npm run lint:fix`, `npx prettier --write ${filenames.join(" ")}`],

  "**/*.(md|json)": (filenames) => `yarn prettier --write ${filenames.join(" ")}`,
}
