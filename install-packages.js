const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')
const root = process.cwd()

init(root)

// script from: https://stackoverflow.com/questions/31773546/the-best-way-to-run-npm-install-for-nested-folders

function performCommand(folder) {
  // console.log(folder)
  const hasPackageJson = fs.existsSync(path.join(folder, 'package.json'))

  if (hasPackageJson && folder !== root) {
    console.log('===================================================================')
    console.log(`Performing "yarn" inside-> ${path.relative(root, folder)}`)
    console.log('===================================================================')

    yarnInstall(folder)
  }

}

// Performs `yarn`
function yarnInstall(where) {
  childProcess.execSync('yarn', { cwd: where, env: process.env, stdio: 'inherit' })
}

// Lists subfolders in a folder
function subfolders(folder) {
  const folders = fs.readdirSync(folder)
    .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
    .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
    .map(subfolder => path.join(folder, subfolder))

  // console.log(folders)
  return folders
}

function init(folder) {
  console.log(folder)

  // Recurse into subfolders
  for (let subfolder of subfolders(folder)) {
    performCommand(subfolder)
  }
}