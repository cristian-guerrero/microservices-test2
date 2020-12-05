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
    console.log(`Performing "yarn add @microservices-commons/common" inside-> ${path.relative(root, folder)}`)
    console.log('===================================================================')

    yarnInstall(folder)
  }

}

// Performs `yarn`
function yarnInstall(where) {
  childProcess.execSync('yarn add @microservices-commons/common', { cwd: where, env: process.env, stdio: 'inherit' })
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
  const exclude = ['common', 'client', 'nats-test']

  // Recurse into subfolders
  for (let subfolder of subfolders(folder)) {

    if(exclude.includes(path.relative(root, subfolder))) {
      console.log('exclude --> ' , subfolder )
      continue
    }
    console.log(subfolder)
    performCommand(subfolder)
  }
}